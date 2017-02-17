angular.module('uiForDocker')
  .service('containerApi', function($http) {
		var containers  = {};

    containers.getOne = function(id) {
      return $http.get('/api/containers/' + id);
    };

		containers.getAll = function(id) {
      return $http.get('/api/containers/all');
    };
    
    containers.start = function(id) {
      return $http.post('/api/containers/' + id + '/start');
    };
    
    containers.stop = function(id) {
      return $http.post('/api/containers/' + id + '/stop');
    };
    
    containers.remove = function(id) {
      return $http.delete('/api/containers/' + id + '/remove');
    };

    return containers;
  });
