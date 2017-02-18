angular.module('uiForDocker')
  .controller('ContainersCtrl', ContainersCtrl);

ContainersCtrl.$inject = ['$scope', '$http', '$location', 'containerApi', 'toaster', '$route'];

function ContainersCtrl($scope, $http, $location, containerApi, toaster, $route) {
  $scope.isActive = function(route) {
    return route === $location.path();
  }

  containerApi.getAll().then(function(response) {
    $scope.containers = response.data.containers;
  }, function(error) {});

  containerApi.getRunning().then(function(response) {
    $scope.runningContainers = response.data.containers;
  }, function(error) {});

  $scope.checkAll = function() {
    angular.forEach($scope.containers, function(container) {
      container.select = $scope.selectAll;
    });
  };

  $scope.checkAllRunning = function() {
    angular.forEach($scope.runningContainers, function(container) {
      container.select = $scope.selectAllRunning;
    });
  };

  $scope.start = function(containers) {
    for (var i = 0; i < containers.length; i++) {
      if (containers[i].select) {
        var container = containers[i];
        startHandler(container);
      }
    }
  }
	
	$scope.stop = function(containers) {
		for (var i = 0; i < containers.length; i++) {
			if (containers[i].select) {
				var container = containers[i];
				stopHandler(container);
			}
		}
	}
	
	$scope.pause = function(containers) {
		for (var i = 0; i < containers.length; i++) {
			if (containers[i].select) {
				var container = containers[i];
				pauseHandler(container);
			}
		}
	}
	
	$scope.unpause = function(containers) {
		for (var i = 0; i < containers.length; i++) {
			if (containers[i].select) {
				var container = containers[i];
				unpauseHandler(container);
			}
		}
	}
	
	$scope.restart = function(containers) {
		for (var i = 0; i < containers.length; i++) {
			if (containers[i].select) {
				var container = containers[i];
				restartHandler(container);
			}
		}
	}
	
	$scope.remove = function(containers) {
		for (var i = 0; i < containers.length; i++) {
			if (containers[i].select) {
				var container = containers[i];
				removeHandler(container);
			}
		}
	}
	
	
	function startHandler(container) {
		containerApi.start(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " started.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be started.");
			})
	}
	
	function stopHandler(container) {
		containerApi.stop(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " stopped.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be stopped.");
			})
	}
	
	function pauseHandler(container) {
		containerApi.pause(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " paused.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be paused.");
			})
	}
	
	function unpauseHandler(container) {
		containerApi.unpause(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " unpaused.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be unpaused.");
			})
	}
	
	function restartHandler(container) {
		containerApi.restart(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " restarted.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be restarted.");
			})
	}
	
	function removeHandler(container) {
		containerApi.remove(container.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Container " + container.Names[0] + " removed.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Container " + container.Names[0] + " cannot be removed. Is it stopped?");
			})
	}
}
