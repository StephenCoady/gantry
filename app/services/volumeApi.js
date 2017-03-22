angular.module('uiForDocker')
  .service('volumeApi', function($http, authentication) {
    var token = authentication.getToken();
    var config = {
      headers: {
        'x-access-token': token
      }
    };
		var volumes  = {};
    
    volumes.create = function(volume) {
      return $http.post('/api/volumes', volume, config);
    };

    volumes.getOne = function(id) {
      return $http.get('/api/volumes/' + id, config);
    };

		volumes.getAll = function(id) {
      return $http.get('/api/volumes/', config);
    };
    
    volumes.remove = function(id) {
      return $http.delete('/api/volumes/' + id, config);
    };
    
    return volumes;
  });
