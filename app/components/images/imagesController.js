angular.module('uiForDocker')
  .controller('ImagesCtrl', ImagesCtrl)
  .filter('startFrom', function() {
    return function(input, start) {
      if (input == undefined) {
        return
      } else {
        start = +start; //parse to int
        return input.slice(start);
      }
    }
  });

ImagesCtrl.$inject = ['$scope', '$http', 'imageApi', 'toaster', '$route', '$filter', 'FileUploader', 'dockerApi'];

function ImagesCtrl($scope, $http, imageApi, toaster, $route, $filter, FileUploader, dockerApi) {

  $scope.create = {};

  var uploader = $scope.uploader = new FileUploader({
    url: '/api/docker/upload'
  });
  $scope.uploader.queue = [];

  uploader.onAfterAddingFile = function(fileItem) {
    $scope.uploader.queue = [];
    $scope.uploader.queue.push(fileItem);
    $scope.file = fileItem;
  };
  
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    toaster.pop('success', "Success", "Dockerfile uploaded");
    dockerApi.build($scope.create).then(function(response){
      toaster.pop('success', "Success", "Image built successfully");
      $route.reload();
    });
};
  
  

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
      let pages = Math.ceil($scope.getData().length / $scope.pageSize);
      if (pages) {
        return pages;
      } else {
        return 1;
      }
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
    image.tag = "latest";
      imageApi.pull(image)
      .then(function(response) {
        toaster.pop('success', "Success", "Image " + image.name + " pulled.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Image " + image.name + " cannot be pulled.");
      })
  }
  
  $scope.search = function(search) {
    dockerApi.search(search)
    .then(function(response){
      $scope.foundImages = response.data.data;
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
