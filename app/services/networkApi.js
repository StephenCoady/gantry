angular.module('uiForDocker')
  .service('networkApi', function($http, authentication) {
    var token = authentication.getToken();
    var config = {
      headers: {
        'x-access-token': token
      }
    };
		var networks  = {};
    
    networks.create = function(network) {
      return $http.post('/api/networks', network, config);
    };

    networks.getOne = function(id) {
      return $http.get('/api/networks/' + id, config);
    };

		networks.getAll = function() {
      return $http.get('/api/networks/', config);
    };
    
    networks.remove = function(id) {
      return $http.delete('/api/networks/' + id, config);
    };

    return networks;
  });
