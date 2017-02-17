angular.module('uiForDocker')
  .controller('DashCtrl', DashCtrl);

DashCtrl.$inject = ['$scope', '$http', '$route', '$location', 'containerApi', 'imageApi', 'networkApi'];

function DashCtrl($scope, $http, $route, $location, containerApi, imageApi, networkApi) {
  $scope.running = 0;
  $scope.stopped = 0;
	$scope.paused = 0;
  $scope.imagesSize = 0;

  containerApi.getAll().then(function(response) {
    $scope.containers = response.data.containers;
    for (var i = 0; i < response.data.containers.length; i++) {
      if (response.data.containers[i].State === "running") {
        $scope.running = $scope.running + 1;
      } else if (response.data.containers[i].State === "exited") {
        $scope.stopped = $scope.stopped + 1;
      } else if (response.data.containers[i].State === "paused") {
        $scope.paused = $scope.paused + 1;
      }
    }
  }, function(error) {});

  imageApi.getAll().then(function(response) {
    var size = 0;
    response.data.images.forEach(function(image) {
      var size = image.VirtualSize;
      var sizeMegabytes = size / 1000000;
      $scope.imagesSize = $scope.imagesSize + Math.round(sizeMegabytes.toString().substring(0, 5));
    });
    $scope.imagesSize = $scope.imagesSize.toFixed(1) / 1000;
    $scope.images = response.data.images;
  }, function(error) {});
	
	networkApi.getAll().then(function(response) {
		$scope.networks = response.data.networks;
	}, function(error) {});
}
