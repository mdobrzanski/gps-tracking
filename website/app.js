'use strict';

// Declare app level module which depends on views, and components
angular.module('gpsTracker', ['ngRoute', 'gpsTracker.main', 'gpsTracker.map'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.otherwise({redirectTo: '/main'});

    }]);