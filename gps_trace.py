__author__ = 'mike'


#!/usr/bin/env python
import json

import socket
import requests


def gps_trace():
    HOST = ''
    TCP_PORT = 8090
    BUFFER_SIZE = 1024  # Normally 1024, but we want fast response

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((HOST, TCP_PORT))
    s.listen(1)

    conn, addr = s.accept()
    print 'Connection address:', addr
    while 1:
        data = conn.recv(BUFFER_SIZE)
        if not data: break
        yield data
    conn.close()

keys = ['unknown1', 'device_id', 'version', 'time', 'unknown2', 'latitude', 'ns', 'longitude', 'ew',
        'speed', 'elevation', 'unknown3', 'unknown4', 'gsm_country_id', 'gsm_network_id', 'unknown5', 'unknown6']

for row in gps_trace():
    if row.startswith('*') and row.endswith('#'):
        values = row[1:-1].split(',')
        d = dict(zip(keys, values))
        response = requests.post('http://127.0.0.1:6543/db/GPSTracking/trace.json',
                                 data=json.dumps(d),
                                 auth=('admin', 'admin'))
        print response.status_code
