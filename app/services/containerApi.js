angular.module('uiForDocker')
  .service('containerApi', function($http, authentication) {
    var token = authentication.getToken();
    var config = {
      headers: {
        'x-access-token': token
      }
    };
		var containers  = {};
    
    containers.getOne = function(id) {
      return $http.get('/api/containers/' + id, config);
    };

		containers.getAll = function() {
      return $http.get('/api/containers/all', config);
    };
    
    containers.getRunning = function() {
      return $http.get('/api/containers/running', config);
    };
    
    containers.getStats = function(id) {
      return $http.get('/api/containers/' + id + '/stats', {ignoreLoadingBar: true}, config);
    };
    
    containers.start = function(id) {
      return $http.post('/api/containers/' + id + '/start', {}, config);
    };
    
    containers.stop = function(id) {
      return $http.post('/api/containers/' + id + '/stop', {}, config);
    };
    
    containers.pause = function(id) {
      return $http.post('/api/containers/' + id + '/pause', {}, config);
    };
    
    containers.unpause = function(id) {
      return $http.post('/api/containers/' + id + '/unpause', {}, config);
    };
    
    containers.restart = function(id) {
      return $http.post('/api/containers/' + id + '/restart', {}, config);
    };
    
    containers.remove = function(id) {
      return $http.delete('/api/containers/' + id + '/remove', config);
    };
    
    containers.create = function(options) {
      return $http.post('/api/containers/create', options, config);
    };

    return containers;
  });
