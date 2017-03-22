angular.module('uiForDocker')
  .service('dockerApi', function($http, authentication) {
    var token = authentication.getToken();
    var config = {
      headers: {
        'x-access-token': token
      }
    };
		var docker  = {};

    docker.getInfo = function() {
      return $http.get('/api/docker/info', config);
    };
    
    docker.getEvents = function() {
      return $http.get('/api/docker/events', config);
    };

    docker.getLogs = function(id) {
      return $http.get('/api/docker/logs/' + id, config);
    };

    docker.upload = function() {
      return $http.post('/api/docker/upload/', {}, config);
    };

    docker.build = function(options) {
      return $http.post('/api/docker/build/', options, config);
    };
    
    return docker;
  });
