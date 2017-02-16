angular.module('uiForDocker', ['ngRoute', 'toaster', 'ngAnimate'])
  .controller('LandingCtrl', function($scope, containerApi, imageApi, toaster, $route) {})
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'components/main/main.html'
      })
      .when('/containers', {
        controller: 'ContainersCtrl',
        templateUrl: 'components/containers/containers.html'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);
