angular.module('uiForDocker')
  .controller('StatsCtrl', StatsCtrl);

StatsCtrl.$inject = ['$scope', '$http', '$routeParams', 'containerApi', 'toaster', '$route', '$location', '$interval'];

function StatsCtrl($scope, $http, $routeParams, containerApi, toaster, $route, $location, $interval) {

  containerApi.getOne($routeParams.Id).then(function(response) {
    $scope.container = response.data.container;
  }, function(error) {});

  // let date = new Date();
  // let initialTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

  $scope.cpuLabels = [];
  $scope.memoryLabels = [];
  $scope.networkLabels = [];

  $scope.cpuData = [];
  $scope.memoryData = [];
  $scope.networkData = [[],[]];
  
  $scope.networkSeries = ['RxData', 'TxData'];
  
  $scope.networkColours = ['#42B185', '#ED956B'];

  $scope.updateGraphs = function() {
    containerApi.getStats($routeParams.Id).then(function(response) {
      let time = response.data.stats.read;
      time = time.substring(time.indexOf('T') + 1, time.indexOf('T') + 9);

      $scope.cpuLabels.push(time);
      $scope.memoryLabels.push(time);
      $scope.networkLabels.push(time);

      var cpuDelta = response.data.stats.cpu_stats.cpu_usage.total_usage - response.data.stats.precpu_stats.cpu_usage.total_usage;
      var systemDelta = response.data.stats.cpu_stats.system_cpu_usage - response.data.stats.precpu_stats.system_cpu_usage;
      var RESULT_CPU_USAGE = cpuDelta / systemDelta * 100;



      if ($scope.cpuData.length > 10) {
        $scope.cpuData.splice(0, 1);
        $scope.cpuLabels.splice(0, 1);

        $scope.memoryData.splice(0, 1);
        $scope.memoryLabels.splice(0, 1);
        
        $scope.networkData[0].splice(0, 1);
        $scope.networkData[1].splice(0, 1);
        $scope.networkLabels.splice(0, 1);

        $scope.cpuData.push(RESULT_CPU_USAGE);
        $scope.memoryData.push(response.data.stats.memory_stats.usage / 1000000000);
        $scope.networkData[0].push(response.data.stats.networks.eth0.rx_bytes);
        $scope.networkData[1].push(response.data.stats.networks.eth0.tx_bytes);
      } else {
        $scope.cpuData.push(RESULT_CPU_USAGE);
        $scope.memoryData.push(response.data.stats.memory_stats.usage / 1000000000);
        $scope.networkData[0].push(response.data.stats.networks.eth0.rx_bytes);
        $scope.networkData[1].push(response.data.stats.networks.eth0.tx_bytes);
      }
    })
  };

  $scope.initialLoad = function() {
    $scope.cpuOptions = {
      animation: false,
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          position: 'left',
          ticks: {
            min: 0,
            max: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Percentage'
          }
        }]
      }
    };
    $scope.memoryOptions = {
      animation: false,
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'GB'
          }
        }]
      }
    };
    $scope.networkOptions = {
      animation: false,
      scales: {
        yAxes: [{
          id: 'y-axis-1',
          type: 'linear',
          position: 'left'
        }]
      },
      legend: {
        display: true,
        position: "bottom"
      }
    };
    $scope.updateGraphs();
  };

  $scope.initialLoad();

  var promise = $interval($scope.updateGraphs, 3000);
  $scope.$on('$destroy', function() {
    if (promise)
      $interval.cancel(promise);
  });
}
