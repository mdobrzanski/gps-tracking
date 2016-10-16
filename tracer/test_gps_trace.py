import unittest

from gps_trace import GPSTraceHandler

class DataConversion(unittest.TestCase):

    def test_datetime(self):
        raw_data = {
            'device_id': '123456789',
            'time': '232259',
            'date': '311216'

        }
        trace_data = GPSTraceHandler.raw_to_trace(raw_data)

        expected = {
            'device_id': '123456789',
            'datetime': '2016-12-31T23:22:59',
        }

        self.assertDictEqual(trace_data, expected)