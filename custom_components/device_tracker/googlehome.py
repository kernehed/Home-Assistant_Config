"""
Support for Google Home bluetooth tacker.

For more details about this platform, please refer to the documentation at
https://home-assistant.io/components/device_tracker.googlehome/
"""
import logging
from asyncio import sleep
from json import dumps
from aiohttp import ClientSession
import voluptuous as vol

import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.components.device_tracker import (
    DOMAIN, PLATFORM_SCHEMA, DeviceScanner)
from homeassistant.const import CONF_HOST

REQUIREMENTS = ['googledevices==0.6.0']

_LOGGER = logging.getLogger(__name__)

CONF_RSSI_THRESHOLD = 'rssi_threshold'

PLATFORM_SCHEMA = vol.All(
    PLATFORM_SCHEMA.extend({
        vol.Optional(CONF_HOST): cv.string,
        vol.Optional(CONF_RSSI_THRESHOLD, default=-70): vol.Coerce(int),
    }))


async def async_get_scanner(hass, config):
    """Validate the configuration and return an Google Home scanner."""
    scanner = GoogleHomeDeviceScanner(hass, config[DOMAIN])
    await scanner.async_connect()
    return scanner if scanner.success_init else None


class GoogleHomeDeviceScanner(DeviceScanner):
    """This class queries a Google Home unit."""

    def __init__(self, hass, config):
        """Initialize the scanner."""

        self.last_results = {}
        self.hass = hass
        self.success_init = False


    async def async_connect(self):
        """Initialize connection to Google Home."""
        self.success_init = True

    async def async_scan_devices(self):
        """Scan for new devices and return a list with found device IDs."""
        await self.async_update_info()
        return list(self.last_results.keys())

    async def async_get_device_name(self, device):
        """Return the name of the given device or None if we don't know."""
        if device not in self.last_results:
            return None
        _LOGGER.debug(device)
        return str(device)

    async def get_extra_attributes(self, device):
        """Return the extra attributes of the device."""
        return self.last_results[device]

    async def async_update_info(self):
        """Ensure the information from Google Home is up to date."""
        _LOGGER.debug('Checking Devices...')
        devices = {}
        session = async_get_clientsession(self.hass)
        from googledevices.api.bluetooth import Bluetooth
        from googledevices.utils.scan import NetworkScan
        from googledevices.api.device_info import DeviceInfo
        import netifaces
        gateway = netifaces.gateways().get('default', {})
        ipscope = gateway.get(netifaces.AF_INET, ())[0][:-1] + '0/24'
        async with ClientSession() as session:
            googledevices = NetworkScan(self.hass.loop, session)
            result = await googledevices.scan_for_units(ipscope)
        for host in result:
            if host['bluetooth']:
                _LOGGER.debug(host)
                async with ClientSession() as session:
                    googledevices = DeviceInfo(self.hass.loop, session, host['host'])
                    await googledevices.get_device_info()
                    ghname = googledevices.device_info.get('name')
                async with ClientSession() as session:
                    googledevices = Bluetooth(self.hass.loop, session, host.get('host'))
                    await googledevices.scan_for_devices_multi_run()
                    await sleep(5)
                    await googledevices.get_scan_result()
                    for device in googledevices.devices:
                        _LOGGER.debug(device)
                        mac = device['mac_address']
                        if not devices.get(mac, False):
                            # New device
                            devices[mac] = {}
                            devices[mac]['rssi'] = device.get('rssi')
                            devices[mac]['ghunit'] = ghname
                        elif devices[mac].get('rssi') < device.get('rssi'):
                            # Better RSSI value on this device
                            devices[mac]['rssi'] = device.get('rssi')
                            devices[mac]['ghunit'] = ghname
        
        self.last_results = devices