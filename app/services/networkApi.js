angular.module('uiForDocker')
  .service('networkApi', function($http) {
		var networks  = {};

    networks.getOne = function(id) {
      return $http.get('/api/networks/' + id);
    };

		networks.getAll = function(id) {
      return $http.get('/api/networks/');
    };
    return networks;
  });
