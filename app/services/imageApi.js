angular.module('uiForDocker')
  .service('imageApi', function($http) {
		var images  = {};

    images.getOne = function(id) {
      return $http.get('/api/images/' + id);
    };

		images.getAll = function() {
      return $http.get('/api/images/');
    };
    
    images.remove = function(id) {
      return $http.delete('/api/images/' + id);
    };
    
    images.pull = function(image) {
      return $http.post('/api/images/pull', image);
    };
    
    images.tag = function(id, tag) { 
      return $http.post('/api/images/' + id + '/tag', tag);
    }

    return images;
  });
