angular.module('uiForDocker', [
    'ngRoute',
    'toaster',
    'ngCookies',
    'ngAnimate',
    'ngMaterial',
    'angular-loading-bar',
    'chart.js',
    'angularFileUpload'
  ])
  .controller('LandingCtrl', function($scope, $route, $location, $cookieStore, authentication, $rootScope) {
    $scope.isActive = function(route) {
      return route === $location.path();
    }
    
    $rootScope.isLoggedIn = false;
  
    $scope.logout = function() {
      $cookieStore.remove('Gantry');
      authentication.setIslogged(false);
      $rootScope.isLoggedIn = false;
      $location.path('/login');
    };
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
      .when('/login', {
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.hashPrefix('');
  }])
  .run(['$rootScope', '$location', '$route', 'authentication', '$cookieStore', function($rootScope, $location, $route, authentication, $cookieStore) {
    $rootScope.$on('$routeChangeStart', function(event) {
      if (typeof $cookieStore.get('Gantry') !== 'undefined') {
        authentication.setIslogged(true);
        $rootScope.isLoggedIn = true;
      }
      var path = $location.path();
      if (!authentication.isLoggedIn()) {
        console.log('DENY on route: ', $location.path());
        if (path !== "/login") {
          $rootScope.isLoggedIn = false;
          $location.path('/login');
        }
      } else {
        $rootScope.isLoggedIn = true;
        console.log('ALLOW on route: ', $location.path());
      }
    });
  }]);
