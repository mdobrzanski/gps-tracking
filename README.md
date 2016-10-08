# gps-tracking

GPS with GPRS tracker sends data over TCP to TCP server (GPS-Tracer) that listens on port 8090. The GPS-Tracer is written in Python parses the data and pushes it to sqlite database using REST API provided by SlashDB instance. All data is available via REST.'

Simple app using AngularJS, OpenLayers and Open Street Maps to display collected data.

GPS Tracker -> TCP server in python -> REST API SlashDB -> sqlite database.
