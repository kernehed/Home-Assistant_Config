"""

Get weather alerts and warnings from SMHI.

Example configuration

sensor:
  - platform: smhialert
    district: 'all'

Or specifying a specific district.
sensor:
  - platform: smhialert
    district: '019'

Available districts: See README.md

"""
import logging
import json
from datetime import timedelta

from urllib.request import urlopen

import voluptuous as vol

import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.entity import Entity
from homeassistant.components.sensor import PLATFORM_SCHEMA
from homeassistant.const import (CONF_NAME)
from homeassistant.util import Throttle
from homeassistant.components.rest.sensor import RestData

__version__ = '1.0.0'

_LOGGER = logging.getLogger(__name__)

# Using one name to be able to use the custom smhialert-card
NAME = 'SMHIAlert'
CONF_DISTRICT = 'district'
CONF_LANGUAGE = 'language'

SCAN_INTERVAL = timedelta(minutes=5)


PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend({
    vol.Optional(CONF_NAME): cv.string,
    vol.Optional(CONF_DISTRICT, default='all'): cv.string,
    vol.Optional(CONF_LANGUAGE, default='en'): cv.string
})


def setup_platform(hass, config, add_entities, discovery_info=None):
    district = config.get(CONF_DISTRICT)
    language = config.get(CONF_LANGUAGE)
    api = SMHIAlert(district, language)

    add_entities([SMHIAlertSensor(api, NAME)], True)


class SMHIAlertSensor(Entity):
    def __init__(self, api, name):
        self._api = api
        self._name = name
        self._icon = "mdi:alert"

    @property
    def name(self):
        return self._name

    @property
    def icon(self):
        return self._icon

    @property
    def state(self):
        return self._api.data['state']

    @property
    def device_state_attributes(self):
        data = {
            'messages': self._api.attributes['messages'],
            'notice': self._api.attributes['notice']
        }
        return data

    @property
    def available(self):
        return self._api.available

    def update(self):
        self._api.update()


class SMHIAlert:
    def __init__(self, district, language):
        self.district = district
        self.language = language
        self.attributes = {}
        self.attributes["messages"] = []
        self.attributes["notice"] = ""
        self.data = {}
        self.available = True
        self.update()
        if self.language is 'en':
            self.data['state'] = "No Alerts"
        else:
            self.data['state'] = "Inga varningar"

    @Throttle(SCAN_INTERVAL)
    def update(self):
        try:
            response = urlopen(
                'https://opendata-download-warnings.smhi.se/api/version/2/alerts.json')
            data = response.read().decode('utf-8')
            jsondata = json.loads(data)
            
            if self.language is 'en':
                self.data['state'] = "No Alerts"
            else:
                self.data['state'] = "Inga varningar"

            self.attributes['messages'] = []
            self.attributes['notice'] = ""

            if len(jsondata) == 0:
                return

            districts = {}
            notice = ""
            alerts = []
            if isinstance(jsondata['alert'], dict):
                alerts.append(jsondata['alert'])
            else:
                alerts = jsondata['alert']

            for alert in alerts:
                if not (alert['status'] == 'Actual' or alert['status'] == 'System'):
                    continue

                if alert['info']['area']['areaDesc'] != self.district and self.district != 'all':
                    continue

                msg = {}
                
                msg['district_code'] = alert['info']['area']['areaDesc']
                # Districts are named same in both SV and EN
                msg['district_name'] = alert['info']['headline']
                msg['identifier'] = alert['identifier']
                msg['sent'] = alert['sent']
                msg['type'] = alert['msgType']
                msg['category'] = alert['info']['category']
                msg['certainty'] = alert['info']['certainty']
                msg['severity'] = alert['info']['severity']
                msg['link'] = alert['info']['web']
                msg['urgency'] = alert['info']['urgency']

                if self.language is 'en':
                    event_type = "unknown"
                    event_color = "#FFFFFF"
                    for event in alert['info']['eventCode']:
                        if event['valueName'] == "system_event_level":
                            event_type = event['value']
                        if event['valueName'] == "system_event_level_color":
                            event_color = event['value']
                    msg['event'] = event_type
                    msg['event_color'] = event_color
                    msg['description'] = alert['info']['description']

                    # Fetch the english version of the description
                    for param in alert['info']['parameter']:
                        if param['valueName'] == 'system_eng_description':
                            msg['description'] = param['value']

                    # Prefab a notice that can be easily sent in email/notifications
                    notice += '''\
    [{severity}] ({sent})
    District: {district_name}
    Type: {type}
    Certainty: {certainty}
    Descr:
    {description}
    web: {link}?#ws=wpt-a,proxy=wpt-a,district={district_code},page=wpt-warning-alla'\n'''.format(**msg)

                else:
                    event_type = "okänd"
                    event_color = "#FFFFFF"
                    for event in alert['info']['eventCode']:
                        if event['valueName'] == "system_event_level_sv-SE":
                            event_type = event['value']
                        if event['valueName'] == "system_event_level_color":
                            event_color = event['value']
                    msg['event'] = event_type
                    msg['event_color'] = event_color
                    msg['description'] = alert['info']['description']
                    # Prefab a notice that can be easily sent in email/notifications
                    notice += '''\
    [{severity}] ({sent})
    Område: {district_name}
    Typ: {type}
    Trolighet: {certainty}
    Beskrivning:
    {description}
    Länk: {link}?#ws=wpt-a,proxy=wpt-a,district={district_code},page=wpt-warning-alla'\n'''.format(**msg)

                # Add all msgs to each district
                if msg['district_name'] not in districts:
                    districts[msg['district_code']] = {}
                    districts[msg['district_code']
                              ]["name"] = msg['district_name']
                    districts[msg['district_code']]["msgs"] = []
                districts[msg['district_code']]["msgs"].append(msg)



            self.available = True
            if len(districts) != 0:
                self.data['state'] = 'Alert'
                self.attributes['messages'] = districts
                self.attributes['notice'] = notice
        except Exception as e:
            _LOGGER.error("Unable to fetch data from SMHI.")
            _LOGGER.error(str(e))
            self.available = False
