angular.module('uiForDocker')
  .service('dockerApi', function($http) {
		var docker  = {};

    docker.getInfo = function() {
      return $http.get('/api/docker/info');
    };
    
    docker.getEvents = function() {
      return $http.get('/api/docker/events');
    };


    return docker;
  });
