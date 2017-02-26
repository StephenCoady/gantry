angular.module('uiForDocker')
  .service('networkApi', function($http) {
		var networks  = {};

    networks.getOne = function(id) {
      return $http.get('/api/networks/' + id);
    };

		networks.getAll = function() {
      return $http.get('/api/networks/');
    };
    
    networks.remove = function(id) {
      return $http.delete('/api/networks/' + id);
    };
    
    return networks;
  });
