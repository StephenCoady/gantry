angular.module('uiForDocker')
  .service('imageApi', function($http, authentication) {
    var token = authentication.getToken();
    var config = {
      headers: {
        'x-access-token': token
      }
    };
		var images  = {};

    images.getOne = function(id) {
      return $http.get('/api/images/' + id, config);
    };

		images.getAll = function() {
      return $http.get('/api/images/', config);
    };
    
    images.remove = function(id) {
      return $http.delete('/api/images/' + id, config);
    };
    
    images.pull = function(image) {
      return $http.post('/api/images/pull', image, config);
    };
    
    images.tag = function(id, tag) { 
      return $http.post('/api/images/' + id + '/tag', tag, config);
    }

    return images;
  });
