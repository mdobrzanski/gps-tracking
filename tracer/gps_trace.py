#!/usr/bin/env python

import json
import socketserver
import dateutil.parser

import requests


HOST = ''
PORT = 8090
BUFFER_SIZE = 1024

SDB_ENDPOINT = 'http://127.0.0.1:6543/db/GPSTracking/'
SDB_USER = 'admin'
SDB_PASS = 'admin'

DATA_KEYS = ['unknown1', 'device_id', 'version', 'time', 'unknown2', 'latitude', 'ns', 'longitude', 'ew',
             'speed', 'elevation', 'date', 'unknown4', 'gsm_country_id', 'gsm_network_id', 'unknown5', 'unknown6']


class GPSTraceHandler(socketserver.StreamRequestHandler):

    def _post_to_slashdb(self, path, data):
        """Executes POST request to SlashDB."""
        response = requests.post(SDB_ENDPOINT + path, data=json.dumps(data), auth=(SDB_USER, SDB_PASS))
        print('POST to %s: ' % path, response.status_code)

    @staticmethod
    def raw_to_trace(raw_data):
        """Converts raw GPS data dictionary into dictionary for table trace."""
        data = {
            'device_id': raw_data['device_id'],
            'datetime': dateutil.parser.parse(raw_data['date'] + ' ' + raw_data['time']).isoformat(),
            'latitude': raw_data['latitude'],
            'ns': raw_data['ns'],
            'longitude': raw_data['longitude'],
            'ew': raw_data['ew'],
            'speed': raw_data['speed'],
            'elevation': raw_data['elevation']
        }
        return data

    def handle(self):
        row = self.request.recv(1024).strip().decode('ascii')
        print("{} wrote: {}".format(self.client_address[0], row))
        if row.startswith('*') and row.endswith('#'):
            values = row[1:-1].split(',')
            d = dict(zip(DATA_KEYS, values))
            self._post_to_slashdb('raw_trace.json', d)
            self._post_to_slashdb('trace.json', self.raw_to_trace(d))

def slashdb_raw_to_track():
    response = requests.get(SDB_ENDPOINT + 'raw_trace.json', auth=(SDB_USER, SDB_PASS))
    raw_data = json.loads(response.content.decode("utf-8')"))
    for each in raw_data:
        trace_data = GPSTraceHandler.raw_to_trace(each)
        track_response = requests.post(SDB_ENDPOINT + 'trace.json', data=json.dumps(trace_data), auth=(SDB_USER, SDB_PASS))
        print('response ', track_response.status_code)

def main():
    server = socketserver.TCPServer((HOST, PORT), GPSTraceHandler)
    server.serve_forever()


if __name__ == '__main__':
    # main()
    slashdb_raw_to_track()