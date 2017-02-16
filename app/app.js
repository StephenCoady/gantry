angular.module('uiForDocker', ['ngRoute', 'toaster', 'ngAnimate'])
  .controller('LandingCtrl', function($scope, containerApi, imageApi, toaster, $route) {
    $scope.isActive = function (viewLocation) { 
      console.log(viewLocation);
    return viewLocation === $location.path();
};
  })
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'components/main/main.html',
        activetab: 'dashboard'
      })
      .when('/containers', {
        controller: 'ContainersCtrl',
        templateUrl: 'components/containers/containers.html',
        activetab: 'containers'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);
