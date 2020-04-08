"""ESXi Stats Integration."""

import logging
import os
from datetime import datetime, timedelta

from .esxi import (
    esx_connect,
    esx_disconnect,
    check_license,
    get_host_info,
    get_datastore_info,
    get_license_info,
    get_vm_info,
    vm_pwr,
    vm_snap_take,
    vm_snap_remove,
)
from pyVmomi import vim  # pylint: disable=no-name-in-module
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.exceptions import ConfigEntryNotReady
import homeassistant.helpers.config_validation as cv
from homeassistant.const import (
    CONF_HOST,
    CONF_USERNAME,
    CONF_PASSWORD,
    CONF_PORT,
    CONF_VERIFY_SSL,
    # CONF_MONITORED_CONDITIONS,
    __version__ as HAVERSION,
)
from homeassistant.util import Throttle
from .const import (
    AVAILABLE_CMND_VM_SNAP,
    AVAILABLE_CMND_VM_POWER,
    COMMAND,
    DEFAULT_OPTIONS,
    DOMAIN,
    DOMAIN_DATA,
    PLATFORMS,
    REQUIRED_FILES,
    HOST,
    VM,
)

_LOGGER = logging.getLogger(__name__)
MIN_TIME_BETWEEN_UPDATES = timedelta(seconds=45)

VM_PWR_SCHEMA = vol.Schema(
    {
        vol.Required(HOST): cv.string,
        vol.Required(VM): cv.string,
        vol.Required(COMMAND): cv.string,
    }
)
SNAP_CREATE_SCHEMA = vol.Schema(
    {
        vol.Required(HOST): cv.string,
        vol.Required(VM): cv.string
    }, extra=vol.ALLOW_EXTRA
)
SNAP_REMOVE_SCHEMA = vol.Schema(
    {
        vol.Required(HOST): cv.string,
        vol.Required(VM): cv.string,
        vol.Required(COMMAND): cv.string,
    }
)
CONFIG_SCHEMA = vol.Schema(
    {DOMAIN: vol.Schema({}, extra=vol.ALLOW_EXTRA)}, extra=vol.ALLOW_EXTRA
)


async def async_setup(hass, config):
    """Set up this integration using yaml.

    This method is no longer supported.
    """
    return True


async def async_setup_entry(hass, config_entry):
    """Set up this integration using UI."""
    conf = hass.data.get(DOMAIN_DATA)
    if config_entry.source == config_entries.SOURCE_IMPORT:
        if conf is None:
            hass.async_create_task(
                hass.config_entries.async_remove(config_entry.entry_id)
            )
        # This is using YAML for configuration
        return False

    # check all required files
    file_check = await check_files(hass)
    if not file_check:
        return False

    config = {DOMAIN: config_entry.data}
    entry = config_entry.entry_id

    # create data dictionary
    if DOMAIN_DATA not in hass.data:
        hass.data[DOMAIN_DATA] = {}
    hass.data[DOMAIN_DATA][entry] = {}
    hass.data[DOMAIN_DATA][entry]["configuration"] = "config_flow"
    hass.data[DOMAIN_DATA][entry]["vmhost"] = {}
    hass.data[DOMAIN_DATA][entry]["datastore"] = {}
    hass.data[DOMAIN_DATA][entry]["license"] = {}
    hass.data[DOMAIN_DATA][entry]["vm"] = {}
    hass.data[DOMAIN_DATA][entry]["monitored_conditions"] = []

    if config_entry.data["vmhost"]:
        hass.data[DOMAIN_DATA][entry]["monitored_conditions"].append("vmhost")
    if config_entry.data["datastore"]:
        hass.data[DOMAIN_DATA][entry]["monitored_conditions"].append("datastore")
    if config_entry.data["license"]:
        hass.data[DOMAIN_DATA][entry]["monitored_conditions"].append("license")

    if config_entry.data["vm"]:
        hass.data[DOMAIN_DATA][entry]["monitored_conditions"].append("vm")

    if not config_entry.options:
        await async_update_options(hass, config_entry)

    # get global config
    _LOGGER.debug("Setting up host %s", config[DOMAIN].get(CONF_HOST))
    hass.data[DOMAIN_DATA][entry]["client"] = esxiStats(hass, config, config_entry)

    try:
        conn_details = {
            "host": config[DOMAIN]["host"],
            "user": config[DOMAIN]["username"],
            "pwd": config[DOMAIN]["password"],
            "port": config[DOMAIN]["port"],
            "ssl": config[DOMAIN]["verify_ssl"],
        }
        conn = await esx_connect(**conn_details)
        _LOGGER.debug("Product Line: %s", conn.content.about.productLineId)

        # get license type and objects
        lic = check_license(conn.RetrieveContent().licenseManager)
        await hass.data[DOMAIN_DATA][entry]["client"].update_data()
    except Exception as exception:  # pylint: disable=broad-except
        _LOGGER.error(exception)
        raise ConfigEntryNotReady
    finally:
        esx_disconnect(conn)

    # load platforms
    for platform in PLATFORMS:
        hass.async_add_job(
            hass.config_entries.async_forward_entry_setup(config_entry, platform)
        )

    # if lisense allows API write, register services
    if lic:
        await add_services(hass)
    else:
        _LOGGER.info(
            "Service calls are disabled - %s doesn't have a supported license",
            config[DOMAIN]["host"],
        )

    return True


class esxiStats:
    """This class handles communication, services, and stores the data."""

    def __init__(self, hass, config, config_entry=None):
        """Initialize the class."""
        self.hass = hass
        self.config = config[DOMAIN]
        self.host = config[DOMAIN].get(CONF_HOST)
        self.user = config[DOMAIN].get(CONF_USERNAME)
        self.passwd = config[DOMAIN].get(CONF_PASSWORD)
        self.port = config[DOMAIN].get(CONF_PORT)
        self.ssl = config[DOMAIN].get(CONF_VERIFY_SSL)
        self.entry = config_entry.entry_id

    @Throttle(MIN_TIME_BETWEEN_UPDATES)
    async def update_data(self):
        """Update data."""
        conn = None
        try:
            # connect and get data from host
            conn = await esx_connect(
                self.host, self.user, self.passwd, self.port, self.ssl
            )
            content = conn.RetrieveContent()
        except Exception as error:
            _LOGGER.error("ERROR: %s", error)
        else:
            # get host stats
            if self.config.get("vmhost") is True:
                # create/distroy view objects
                host_objview = content.viewManager.CreateContainerView(
                    content.rootFolder, [vim.HostSystem], True
                )
                esxi_hosts = host_objview.view
                host_objview.Destroy()

                # Look through object list and get data
                _LOGGER.debug("Found %s host(s)", len(esxi_hosts))
                for esxi_host in esxi_hosts:
                    host_name = esxi_host.summary.config.name.replace(" ", "_").lower()

                    _LOGGER.debug("Getting stats for vmhost: %s", host_name)
                    self.hass.data[DOMAIN_DATA][self.entry]["vmhost"][
                        host_name
                    ] = await get_host_info(esxi_host)

            # get datastore stats
            if self.config.get("datastore") is True:
                # create/distroy view objects
                ds_objview = content.viewManager.CreateContainerView(
                    content.rootFolder, [vim.Datastore], True
                )
                ds_list = ds_objview.view
                ds_objview.Destroy()

                # Look through object list and get data
                _LOGGER.debug("Found %s datastore(s)", len(ds_list))
                for ds in ds_list:
                    ds_name = ds.summary.name.replace(" ", "_").lower()

                    _LOGGER.debug("Getting stats for datastore: %s", ds_name)
                    self.hass.data[DOMAIN_DATA][self.entry]["datastore"][
                        ds_name
                    ] = await get_datastore_info(ds)

            # get license stats
            if self.config.get("license") is True:
                lic_list = content.licenseManager
                _count = 1

                _LOGGER.debug("Found %s license(s)", len(lic_list.licenses))
                for lic in lic_list.licenses:
                    _LOGGER.debug("Getting stats for licenses")
                    self.hass.data[DOMAIN_DATA][self.entry]["license"][
                        _count
                    ] = await get_license_info(lic, self.host)
                    _count += 1

            # get vm stats
            if self.config.get("vm") is True:
                # create/distroy view objects
                vm_objview = content.viewManager.CreateContainerView(
                    content.rootFolder, [vim.VirtualMachine], True
                )
                vm_list = vm_objview.view
                vm_objview.Destroy()

                # Look through object list and get data
                _LOGGER.debug("Found %s VM(s)", len(vm_list))
                for vm in vm_list:
                    vm_name = vm.summary.config.name.replace(" ", "_").lower()

                    _LOGGER.debug("Getting stats for vm: %s", vm_name)
                    self.hass.data[DOMAIN_DATA][self.entry]["vm"][
                        vm_name
                    ] = await get_vm_info(vm)
        finally:
            if conn is not None:
                esx_disconnect(conn)


async def check_files(hass):
    """Return bool that indicates if all files are present."""
    base = "{}/custom_components/{}/".format(hass.config.path(), DOMAIN)
    missing = []
    for file in REQUIRED_FILES:
        fullpath = "{}{}".format(base, file)
        if not os.path.exists(fullpath):
            missing.append(file)

    if missing:
        _LOGGER.critical("The following files are missing: %s", str(missing))
        returnvalue = False
    else:
        returnvalue = True

    return returnvalue


async def add_services(hass):
    """Add ESXi Stats services."""
    # Check that a host exists in HomeAssistant and get its credentials
    async def get_conn_details(host):
        for _entry in hass.config_entries.async_entries(DOMAIN):
            if host == _entry.data.get("host"):
                return {
                    "host": _entry.data.get("host"),
                    "user": _entry.data.get("username"),
                    "pwd": _entry.data.get("password"),
                    "port": _entry.data.get("port"),
                    "ssl": _entry.data.get("verify_ssl"),
                }
            else:
                continue

        raise ValueError("Host is not configured in HomeAssistant")

    # VM power service
    async def vm_power(call):
        host = call.data["host"]
        vm = call.data["vm"]
        cmnd = call.data["command"]

        if cmnd in AVAILABLE_CMND_VM_POWER:
            try:
                conn_details = await get_conn_details(host)
                hass.async_create_task(vm_pwr(hass, host, vm, cmnd, conn_details))
            except Exception as e:
                _LOGGER.error(str(e))
        else:
            _LOGGER.error("vm_power: '%s' is not a supported command", cmnd)

    # Snapshot create service
    async def snap_create(call):
        host = call.data["host"]
        vm = call.data["vm"]
        memory = False
        quiesce = False
        now = datetime.now()
        desc = "Taken from HASS (" + HAVERSION + ") on " + now.strftime("%x %X")

        if "name" in call.data:
            name = call.data["name"]

        if "description" in call.data:
            desc = call.data["description"]
        if "memory" in call.data:
            memory = call.data["memory"]
        if "quiesce" in call.data:
            quiesce = call.data["quiesce"]

        try:
            conn_details = await get_conn_details(host)
            hass.async_create_task(
                vm_snap_take(hass, host, vm, name, desc, memory, quiesce, conn_details)
            )
        except Exception as e:
            _LOGGER.error(str(e))

    # Snapshot remove service
    async def snap_remove(call):
        host = call.data["host"]
        vm = call.data["vm"]
        cmnd = call.data["command"]

        if cmnd in AVAILABLE_CMND_VM_SNAP:
            try:
                conn_details = await get_conn_details(host)
                hass.async_create_task(
                    vm_snap_remove(hass, host, vm, cmnd, conn_details)
                )
            except Exception as e:
                _LOGGER.error(str(e))
        else:
            _LOGGER.error("snap_remove: '%s' is not a supported command", cmnd)

    hass.services.async_register(
        DOMAIN, "vm_power", vm_power, schema=VM_PWR_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, "create_snapshot", snap_create, schema=SNAP_CREATE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, "remove_snapshot", snap_remove, schema=SNAP_REMOVE_SCHEMA
    )


async def async_remove_entry(hass, config_entry):
    """Handle removal of an entry."""
    if hass.data.get(DOMAIN_DATA, {}).get("configuration") == "yaml":
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": config_entries.SOURCE_IMPORT}, data={}
            )
        )
    else:
        for plafrom in PLATFORMS:
            await hass.config_entries.async_forward_entry_unload(config_entry, plafrom)
        _LOGGER.info("Successfully removed the ESXi Stats integration")


async def async_update_options(hass, config_entry):
    hass.config_entries.async_update_entry(config_entry, options=DEFAULT_OPTIONS)
