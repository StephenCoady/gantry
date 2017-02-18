angular.module('uiForDocker')
  .service('containerApi', function($http) {
		var containers  = {};

    containers.getOne = function(id) {
      return $http.get('/api/containers/' + id);
    };

		containers.getAll = function() {
      return $http.get('/api/containers/all');
    };
    
    containers.getRunning = function() {
      return $http.get('/api/containers/running');
    };
    
    containers.start = function(id) {
      return $http.post('/api/containers/' + id + '/start');
    };
    
    containers.stop = function(id) {
      return $http.post('/api/containers/' + id + '/stop');
    };
    
    containers.pause = function(id) {
      return $http.post('/api/containers/' + id + '/pause');
    };
    
    containers.unpause = function(id) {
      return $http.post('/api/containers/' + id + '/unpause');
    };
    
    containers.restart = function(id) {
      return $http.post('/api/containers/' + id + '/restart');
    };
    
    containers.remove = function(id) {
      return $http.delete('/api/containers/' + id + '/remove');
    };

    return containers;
  });
