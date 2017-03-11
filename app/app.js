angular.module('uiForDocker', ['ngRoute', 'toaster', 'ngAnimate', 'ngMaterial', 'angular-loading-bar', 'chart.js'])
  .controller('LandingCtrl', function($scope, $route, $location) {
    $scope.isActive = function(route) {
      return route === $location.path();
    }
  })
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'components/dashboard/dashboard.html',
        controller: 'DashCtrl'
      })
      .when('/containers', {
        templateUrl: 'components/containers/containers.html',
        controller: 'ContainersCtrl'
      })
      .when('/containers/:Id', {
        templateUrl: 'components/container/container.html',
        controller: 'ContainerCtrl'
      })
      .when('/containers/:Id/stats', {
        templateUrl: 'components/stats/stats.html',
        controller: 'StatsCtrl'
      })
      .when('/images', {
        templateUrl: 'components/images/images.html',
        controller: 'ImagesCtrl'
      })
      .when('/images/:Id', {
        templateUrl: 'components/image/image.html',
        controller: 'ImageCtrl'
      })
      .when('/networks', {
        templateUrl: 'components/networks/networks.html',
        controller: 'NetworksCtrl'
      })
      .when('/networks/:Id', {
        templateUrl: 'components/network/network.html',
        controller: 'NetworkCtrl'
      })
      .when('/volumes', {
        templateUrl: 'components/volumes/volumes.html',
        controller: 'VolumesCtrl'
      })
      .when('/volumes/:Id', {
        templateUrl: 'components/volume/volume.html',
        controller: 'VolumeCtrl'
      })
      .when('/docker', {
        templateUrl: 'components/docker/docker.html',
        controller: 'DockerCtrl'
      })
      .when('/events', {
        templateUrl: 'components/events/events.html',
        controller: 'EventsCtrl'
      })
      .when('/settings', {
        templateUrl: 'components/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  }]);
