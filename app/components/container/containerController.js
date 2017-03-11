angular.module('uiForDocker')
  .controller('ContainerCtrl', ContainerCtrl);

ContainerCtrl.$inject = ['$scope', '$http', '$routeParams', 'containerApi', 'toaster', '$route', '$location', 'dockerApi'];

function ContainerCtrl($scope, $http, $routeParams, containerApi, toaster, $route, $location, dockerApi) {

  containerApi.getOne($routeParams.Id).then(function(response) {
    $scope.container = response.data.container;
  }, function(error) {});

  dockerApi.getLogs($routeParams.Id).then(function(response) {
    // Replace carriage returns with newlines to clean up output
    var data = response.data.response.replace(/[\r]/g, '\n').substring(8).replace(/\n(.{8})/g, '\n');

    $scope.log = data;
  }, function(error) {});

  $scope.start = function(container) {
    containerApi.start(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " started.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be started.");
      })
  }

  $scope.stop = function(container) {
    containerApi.stop(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " stopped.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be stopped.");
      })
  }

  $scope.pause = function(container) {
    containerApi.pause(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " paused.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be paused.");
      })
  }

  $scope.unpause = function(container) {
    containerApi.unpause(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " unpaused.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be unpaused.");
      })
  }

  $scope.restart = function(container) {
    containerApi.restart(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " restarted.");
        $route.reload();
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be restarted.");
      })
  }

  $scope.remove = function(container) {
    containerApi.remove(container.Id)
      .then(function(response) {
        toaster.pop('success', "Success", "Container " + container.Name + " removed.");
        $location.path('/containers');
      })
      .catch(function(e) {
        toaster.pop('error', "Error", "Container " + container.Name + " cannot be removed. Is it stopped?");
      })
  }
  
  $scope.viewContainer = function(container) {
    $location.path('/containers/' + container.Id + '/stats');
  };
}
