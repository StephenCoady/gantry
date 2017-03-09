angular.module('uiForDocker')
  .service('dockerApi', function($http) {
		var docker  = {};

    docker.getInfo = function() {
      return $http.get('/api/docker/info');
    };
    
    docker.getEvents = function() {
      return $http.get('/api/docker/events');
    };

    docker.getLogs = function(id) {
      return $http.get('/api/docker/logs/' + id);
    };
    
    return docker;
  });
