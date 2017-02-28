angular.module('uiForDocker')
  .controller('ContainersCtrl', ContainersCtrl);

ContainersCtrl.$inject = ['$scope', '$http', '$location', 'containerApi', 'imageApi', 'toaster', '$route', '$filter'];

function ContainersCtrl($scope, $http, $location, containerApi, imageApi, toaster, $route, $filter) {
  $scope.base = ($location.$$host);
  $scope.isActive = function(route) {
    return route === $location.path();
  }
  
  $scope.form = {
    Volumes: []
  }
  
  $scope.options = {
    name: "",
    Image: "",
    ExposedPorts: {},
    HostConfig: {
      PortBindings: [],
      Binds: [],
      NetworkMode: "bridge",
      Privileged: false
    }
  };

  $scope.addPortBinding = function() {
    $scope.options.HostConfig.PortBindings.push({
      hostPort: '',
      containerPort: '',
      protocol: 'tcp'
    });
  };

  $scope.removePortBinding = function(index) {
    $scope.options.HostConfig.PortBindings.splice(index, 1);
  };

  $scope.addVolume = function() {
    $scope.form.Volumes.push({
      name: '',
      containerPath: ''
    });
  };

  $scope.removeVolume = function(index) {
    $scope.form.Volumes.splice(index, 1);
  };

  function preparePortBindings(options) {
    var bindings = {};
    options.HostConfig.PortBindings.forEach(function(portBinding) {
      if (portBinding.containerPort) {
        var key = portBinding.containerPort + "/" + portBinding.protocol;
        var binding = {};
        if (portBinding.hostPort && portBinding.hostPort.indexOf(':') > -1) {
          var hostAndPort = portBinding.hostPort.split(':');
          binding.HostIp = hostAndPort[0];
          binding.HostPort = hostAndPort[1];
        } else {
          binding.HostPort = portBinding.hostPort;
        }
        bindings[key] = [binding];
        $scope.options.ExposedPorts[key] = {};
      }
    });
    $scope.options.HostConfig.PortBindings = bindings;
  };
  
  function prepareVolumes() {
  var binds = [];
  var volumes = {};

  $scope.form.Volumes.forEach(function (volume) {
    var name = volume.name;
    var containerPath = volume.containerPath;
    if (name && containerPath) {
      var bind = name + ':' + containerPath;
      volumes[containerPath] = {};
      if (volume.readOnly) {
        bind += ':ro';
      }
      binds.push(bind);
    }
  });
  $scope.options.HostConfig.Binds = binds;
  $scope.options.Volumes = volumes;
}

  $scope.createContainer = function() {
    preparePortBindings($scope.options);
    prepareVolumes();
    let image = {};
    image.name = $scope.options.Image;
    if($scope.options.tag === undefined){
      image.tag = 'latest'
    }
    else{
      image.tag = $scope.options.tag;
    }
    imageApi.pull(image)
    .then(function(response) {
      toaster.pop('success', "Success", "Image " + $scope.options.Image + " pulled.");
    })
    .then(function(response) {
      containerApi.create($scope.options)
        .then(function(response) {
          toaster.pop('success', "Success", "Container " + $scope.options.name + " created.");
          $route.reload();
          return response;
        })
        .then(function(response) {
          containerApi.start(response.data.data.id)
            .then(function(response) {
              toaster.pop('success', "Success", "Container " + $scope.options.name + " started.");
              $route.reload();
            })
            .catch(function(e) {
              toaster.pop('error', "Error", "Container " + $scope.options.name + " cannot be started.");
            })
        })
    })
    .catch(function(e) {
      toaster.pop('error', "Error", "Image " + $scope.options.Image + " cannot be pulled. Is the account named included?");
    })
  };

  containerApi.getAll().then(function(response) {
    $scope.containers = response.data.containers;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.q = '';
    $scope.getData = function() {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.containers, $scope.q)
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
    angular.forEach($scope.containers, function(container) {
      container.select = $scope.selectAll;
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
