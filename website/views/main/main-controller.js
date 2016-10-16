'use strict';

angular.module('gpsTracker.main', ['ngRoute', 'angularSlashDB', 'gpsTracker.map'])
    .config(['$routeProvider', 'slashDBProvider',  function($routeProvider, slashDBProvider) {
        $routeProvider.when('/main', {
            templateUrl: '/views/main/main-template.html',
            controller: 'MainViewCtrl',
            controllerAs: 'ctrl'

        });
        slashDBProvider.setEndpoint('http://localhost:6543')
    }])

    .controller('MainViewCtrl', ['slashDB', function(slashDB) {
        console.log('in main controller');
        var ctrl = this;
    }]);