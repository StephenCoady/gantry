angular.module('uiForDocker')
  .service('imageApi', function($http) {
		var images  = {};

    images.getOne = function(id) {
      return $http.get('/api/images/' + id);
    };

		images.getAll = function() {
      return $http.get('/api/images/');
    };

    return images;
  });
