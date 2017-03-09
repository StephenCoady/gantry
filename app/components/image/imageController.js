angular.module('uiForDocker')
  .controller('ImageCtrl', ImageCtrl);

ImageCtrl.$inject = ['$scope', '$http', 'imageApi', 'toaster', '$route', '$filter', '$routeParams'];

function ImageCtrl($scope, $http, imageApi, toaster, $route, $filter, $routeParams) {

  imageApi.getOne($routeParams.Id).then(function(response) {
    
    $scope.image = response.data.image;
    $scope.image.Created = Date.parse(response.data.image.Created);

  }, function(error) {});
  
  $scope.remove = function(tag) {
    let noSlashes = tag.replace(/\//g, '%2F');

    imageApi.remove(noSlashes)
      .then(function(response) {
        toaster.pop('success', "Success", "Image tag " + tag + " removed.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Image tag " + tag + " cannot be removed.");
      })
  };
  
  $scope.tagImage = function(tag) {
    
    if(!tag.repo){
      tag.repo = 'emptyTag'
    } else{
      tag.repo = tag.repo.toLowerCase();
    }
    
    if(!tag.tag){
      tag.tag = 'latest';
    } else {
      tag.tag = tag.tag.toLowerCase();
    }
        
    imageApi.tag($scope.image.Id, tag)
      .then(function(response) {
        toaster.pop('success', "Success", "Image tag " + tag.repo + ":" + tag.tag + " added.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Image tag " + tag.repo + ":" + tag.tag + " cannot be added.");
      })
  };

}
