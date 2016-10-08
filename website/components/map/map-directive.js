'use strict';

angular.module('gpsTracker.map', ['angularSlashDB'])
    .directive('map', ['slashDB', function(slashDB) {
        return {
            templateUrl: "/components/map/map-template.html",
            scope: {},
            link: function(scope, elm, attrs) {
                var nmeaToDecDeg = function(nmeaStr) {
                    var match = new RegExp('(\\d\\d\\d?)(\\d\\d\\.\\d+)').exec(nmeaStr);
                    var decDeg = match[1]/1 + match[2]/60;
                    console.log(decDeg);
                    return decDeg
                };

                var center = [nmeaToDecDeg('02100.6749'), nmeaToDecDeg('5211.2878')];
                center = ol.proj.fromLonLat(center);

                var map = new ol.Map({
                    target: 'map',
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })
                    ],
                    view: new ol.View({
                        center: center,
                        zoom: 10
                    })
                });

                slashDB.get('/db/GPSTracking/trace.json')
                    .then(function(response){
                        scope.gpsTraces = [];
                        for (var i=0; i < response.data.length; i++){
                            var row = response.data[i];
                            var pos = {
                                latitude: row.latitude,
                                ns: row.ns,
                                longitude: row.longitude,
                                ew: row.es
                            };
                            scope.gpsTraces.push(pos)
                        }
                       addMarkers(scope.gpsTraces);
                    });

                var addMarkers = function(gpsTraces) {
                    if (scope.markerLayer) map.removeLayer(scope.markerLyaer);
                    var markers = [];

                    for (var i=0; i < gpsTraces.length; i++){
                        var trace = gpsTraces[i];
                        console.log(trace);
                        var marker = new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([nmeaToDecDeg(trace.longitude), nmeaToDecDeg(trace.latitude)])),
                            name: 'Null Island',
                            population: 4000,
                            rainfall: 500
                        });
                        markers.push(marker);
                    }

                    var vectorSource = new ol.source.Vector({features: markers});

                    var fill = new ol.style.Fill({color: 'rgba(255,255,255,0.4)'});
                    var stroke = new ol.style.Stroke({color: '#3399CC',width: 2.25});

                    var iconStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: fill,
                            stroke: stroke,
                            radius: 5
                        }),
                        fill: fill,
                        stroke: stroke
                    });

                    scope.markerLayer = new ol.layer.Vector({
                        source: vectorSource,
                        style: iconStyle
                    });

                    map.addLayer(scope.markerLayer);
                };
            }
        }
    }]);