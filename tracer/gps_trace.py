#!/usr/bin/env python

import json
import requests
import socketserver

HOST = ''
PORT = 8090
BUFFER_SIZE = 1024

SDB_ENDPOINT = 'http://127.0.0.1:6543/db/GPSTracking/trace.json'
SDB_USER = 'admin'
SDB_PASS = 'admin'

DATA_KEYS = ['unknown1', 'device_id', 'version', 'time', 'unknown2', 'latitude', 'ns', 'longitude', 'ew',
             'speed', 'elevation', 'unknown3', 'unknown4', 'gsm_country_id', 'gsm_network_id', 'unknown5', 'unknown6']


class GPSTraceHandler(socketserver.StreamRequestHandler):

    def handle(self):
        row = self.request.recv(1024).strip().decode('ascii')
        print("{} wrote: {}".format(self.client_address[0], row))
        if row.startswith('*') and row.endswith('#'):
            values = row[1:-1].split(',')
            d = dict(zip(DATA_KEYS, values))
            response = requests.post(SDB_ENDPOINT, data=json.dumps(d), auth=(SDB_USER, SDB_PASS))
            print(response.status_code)


def main():
    server = socketserver.TCPServer((HOST, PORT), GPSTraceHandler)
    server.serve_forever()


if __name__ == '__main__':
    main()