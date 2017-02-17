angular.module('uiForDocker', ['ngRoute', 'toaster', 'ngAnimate'])
  .controller('LandingCtrl', function($scope, $route, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
  })
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'DashCtrl',
        templateUrl: 'components/dashboard/dashboard.html'
      })
      .when('/containers', {
        controller: 'ContainersCtrl',
        templateUrl: 'components/containers/containers.html'
      })
      .when('/images', {
        controller: 'ImagesCtrl',
        templateUrl: 'components/images/images.html'
      })
      .when('/networks', {
        controller: 'NetworksCtrl',
        templateUrl: 'components/networks/networks.html'
      })
      .when('/host', {
        controller: 'HostCtrl',
        templateUrl: 'components/host/host.html'
      })
      .when('/docker', {
        controller: 'DockerCtrl',
        templateUrl: 'components/docker/docker.html'
      })
      .when('/settings', {
        controller: 'SettingsCtrl',
        templateUrl: 'components/settings/settings.html'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);
