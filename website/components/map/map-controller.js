'use strict';

angular.module('gpsTracker.map', [])
    .component('map', {
        templateUrl: "/components/map/map-template.html",
        bindings: {
            deviceId: '<',
            datetimeRange: '<'
        },
        controller: ['slashDB', function MapController(slashdb){
            var ctrl = this;

            ctrl.init = function (){
                var center = [ctrl.nmeaToDecDeg('02100.6749'), ctrl.nmeaToDecDeg('5211.2878')];
                center = ol.proj.fromLonLat(center);

                ctrl.map = new ol.Map({
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

                slashdb.get('/db/GPSTracking/trace.json?sort=datetime')
                    .then(function(response){
                        ctrl.gpsTraces = response.data;
                        ctrl.addMarkerLayer(ctrl.getMarkers(ctrl.gpsTraces));
                        ctrl.addLineLayer(ctrl.getPoints(ctrl.gpsTraces));
                    });
            };

            ctrl.nmeaToDecDeg = function(nmeaStr) {
                var match = new RegExp('(\\d\\d\\d?)(\\d\\d\\.\\d+)').exec(nmeaStr);
                return match[1]/1 + match[2]/60;
            };

            ctrl.getPoints = function(gpsTraces) {
                if (ctrl.markerLayer) ctrl.map.removeLayer(ctrl.markerLyaer);
                var points = [];

                for (var i=0; i < gpsTraces.length; i++){
                    var trace = gpsTraces[i];
                    var point = ol.proj.fromLonLat([ctrl.nmeaToDecDeg(trace.longitude), ctrl.nmeaToDecDeg(trace.latitude)])
                    points.push(point);
                }
                return points
            };

            ctrl.getMarkers = function(gpsTraces) {
                if (ctrl.markerLayer) ctrl.map.removeLayer(ctrl.markerLyaer);

                //var fill = new ol.style.Fill({color: 'rgba(255,255,255,0.4)'});
                //var stroke = new ol.style.Stroke({color: '#3399CC', width: 2.25});

                var iconStyle = new ol.style.Style({
                    //image: new ol.style.Circle({
                    //    fill: fill,
                    //    stroke: stroke,
                    //    radius: 2
                    //}),
                    //fill: fill,
                    //stroke: stroke,
                    text: new ol.style.Text({
                        text: "Wow such label",
                        offsetY: -25,
                        fill: new ol.style.Fill({
                            color: '#000'
                        })
                    })
                });

                var markers = [];

                for (var i=0; i < gpsTraces.length; i++){
                    var trace = gpsTraces[i];
                    console.log(trace);
                    var marker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([ctrl.nmeaToDecDeg(trace.longitude), ctrl.nmeaToDecDeg(trace.latitude)])),
                        style: iconStyle
                    });
                    markers.push(marker);
                }
                return markers
            };

            ctrl.addMarkerLayer = function(markers) {
                var vectorSource = new ol.source.Vector({features: markers});

                //var fill = new ol.style.Fill({color: 'rgba(255,255,255,0.4)'});
                //var stroke = new ol.style.Stroke({color: '#3399CC', width: 2.25});
                //
                //var iconStyle = new ol.style.Style({
                //    image: new ol.style.Circle({
                //        fill: fill,
                //        stroke: stroke,
                //        radius: 1
                //    }),
                //    fill: fill,
                //    stroke: stroke,
                //    text: new ol.style.Text({
                //        text: "Wow such label",
                //        offsetY: -25,
                //        fill: new ol.style.Fill({
                //            color: '#000'
                //        })
                //    })
                //});

                ctrl.markerLayer = new ol.layer.Vector({
                    source: vectorSource,
                    //style: iconStyle
                });

                ctrl.map.addLayer(ctrl.markerLayer);
            };

            ctrl.addLineLayer = function (markers) {
                console.log(markers);
                ctrl.layerLines = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [new ol.Feature({
                            geometry: new ol.geom.LineString(markers),
                            name: 'Line'
                        })]
                    })
                });

                ctrl.map.addLayer(ctrl.layerLines)
            };

            ctrl.init();

        }]

    });