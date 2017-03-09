angular.module('uiForDocker')
  .controller('DashCtrl', DashCtrl);

DashCtrl.$inject = ['$scope', '$http', '$route', '$location', 'containerApi', 'imageApi', 'networkApi', 'volumeApi', 'dockerApi'];

function DashCtrl($scope, $http, $route, $location, containerApi, imageApi, networkApi, volumeApi, dockerApi) {
  $scope.imagesSize = 0;
  $scope.imageLabels = ["Used", "Available"];
  $scope.imageData = [];
  $scope.height_chart = '90';
  $scope.options = {
    legend: {
      display: true,
      position: "bottom"
    }
  };
  $scope.imageColours = ['#ED956B', '#42B185'];
  

  $scope.netLabels = [];

  $scope.netData = [];

  dockerApi.getInfo().then(function(res) {
    if((res.data.info.ContainersRunning + 
      res.data.info.ContainersStopped + 
      res.data.info.ContainersPaused) == 0){
        $scope.containerLabels = ["No Containers on host"];
        $scope.containerData = [1];
        $scope.containerColours = ['#EA3A3A'];
      } else {
        $scope.containerColours = ['#42B185', '#6BC3ED', '#ED956B'];
        $scope.containerLabels = ["Running", "Paused", "Stopped"];
        $scope.containerData = [
          res.data.info.ContainersRunning, 
          res.data.info.ContainersPaused,
          res.data.info.ContainersStopped 
        ];
      }
    $scope.images = res.data.info.Images;
    $scope.cpus = res.data.info.NCPU;
    $scope.architecture = res.data.info.Architecture;
    $scope.os = res.data.info.OSType;
    $scope.memTotal = (res.data.info.MemTotal.toFixed(1) / 1000000000).toString().substring(0, 6);
    $scope.serverVersion = res.data.info.ServerVersion;


  }, function(error) {})
  .then(function() {
    imageApi.getAll().then(function(response) {
      var size = 0;
      response.data.images.forEach(function(image) {
        var size = image.VirtualSize;
        var sizeMegabytes = size;
        $scope.imagesSize += Math.round(sizeMegabytes.toString());
      });
      $scope.imagesSize = ($scope.imagesSize.toFixed(1) / 1000000000).toString().substring(0, 6);
      $scope.imageData[0] = $scope.imagesSize;
      $scope.imageData[1] = ($scope.memTotal - $scope.imageData[0]).toFixed(1);
    }, function(error) {});
  })

  networkApi.getAll().then(function(res) {
    $scope.networks = res.data.networks;
    for (var i = 0; i < $scope.networks.length; i++) {
      $scope.networks[i].Name = $scope.networks[i].Name.substring(0, 12);
      $scope.netLabels.push($scope.networks[i].Name);
      let size = parseInt(Object.keys($scope.networks[i].Containers).length);
      $scope.netData.push(size);
    }
  }, function(error) {});
  
  volumeApi.getAll().then(function(res) {
    $scope.volumes = res.data.volumes.Volumes;
  }, function(error) {});
}
