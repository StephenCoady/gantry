angular.module('uiForDocker')
  .service('volumeApi', function($http) {
		var volumes  = {};

    volumes.getOne = function(id) {
      return $http.get('/api/volumes/' + id);
    };

		volumes.getAll = function(id) {
      return $http.get('/api/volumes/');
    };
    
    volumes.remove = function(id) {
      return $http.delete('/api/volumes/' + id);
    };
    
    return volumes;
  });
