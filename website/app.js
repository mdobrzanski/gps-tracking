'use strict';

// Declare app level module which depends on views, and components
angular.module('gpsTracker', ['ngRoute', 'gpsTracker.main'])
    .config(['$locationProvider', '$routeProvider', 'slashDBProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.otherwise({redirectTo: '/main'});

    }]);