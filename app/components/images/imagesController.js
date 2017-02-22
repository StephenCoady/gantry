angular.module('uiForDocker')
  .controller('ImagesCtrl', ImagesCtrl)
	.filter('startFrom', function() {
    return function(input, start) {
      if (input == undefined){
        return
      } else {
        start = +start; //parse to int
        return input.slice(start);    
      }
    }
});

ImagesCtrl.$inject = ['$scope', '$http', 'imageApi', 'toaster', '$route', '$filter'];

function ImagesCtrl($scope, $http, imageApi, toaster, $route, $filter) {


  imageApi.getAll().then(function(response) {
    response.data.images.forEach(function(image) {
      var sizeBytes = image.VirtualSize;
      var sizeMegabytes = sizeBytes / 1000000;
      image.VirtualSize = Math.round(sizeMegabytes.toString().substring(0, 5));
    });
    $scope.images = response.data.images;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.q = '';
    $scope.getData = function() {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.images, $scope.q)
    }
    $scope.numberOfPages = function() {
      return Math.ceil($scope.getData().length / $scope.pageSize);
    }

    $scope.$watch('q', function(newValue, oldValue) {
      if (oldValue != newValue) {
        $scope.currentPage = 0;
      }
    }, true);

  }, function(error) {});

  $scope.checkAll = function() {
    angular.forEach($scope.images, function(image) {
      image.select = $scope.selectAll;
    });
  };

  $scope.remove = function(images) {
    for (var i = 0; i < images.length; i++) {
      if (images[i].select) {
        var image = images[i];
        removeHandler(image);
      }
    }
  }
  
  $scope.pullImage = function(image) {
    if (image.tag === undefined){
      image.tag = 'latest'
    }
    imageApi.pull(image)
    .then(function(response) {
      toaster.pop('success', "Success", "Image " + image.name + "/" + image.tag + " pulled.");
      $route.reload();
    })
    .catch(function(e) {
      toaster.pop('error', "Error", "Image " + image.name + "/" + image.tag + " cannot be pulled. Is the account named included?");
    })
  }

  function removeHandler(image) {
    imageApi.remove(image.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Image " + image.Id.substring(0, 15) + " removed.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Image " + image.Id.substring(0, 15) + " cannot be removed. Remove any containers using it first.");
      })
  }
}
