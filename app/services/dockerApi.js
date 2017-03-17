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

    docker.upload = function() {
      return $http.post('/api/docker/upload/');
    };

    docker.build = function(options) {
      return $http.post('/api/docker/build/', options);
    };
    
    return docker;
  });
