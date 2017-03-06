angular.module('uiForDocker')
.controller('VolumesCtrl', VolumesCtrl);

VolumesCtrl.$inject = ['$scope', '$http', 'volumeApi', '$filter', 'toaster', '$route']; 

function VolumesCtrl($scope, $http, volumeApi, $filter, toaster, $route) {
	volumeApi.getAll().then(function(response) {
		$scope.volumes = response.data.volumes.Volumes;
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.q = '';
		$scope.getData = function() {
			return $filter('filter')($scope.volumes, $scope.q)
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
		angular.forEach($scope.volumes, function(volume) {
			volume.select = $scope.selectAll;
		});
	};
	
	$scope.createVolume = function(volume) {
		volumeApi.create(volume)
		.then(function(response) {
			console.log(response);
			toaster.pop('success', "Success", "Volume " + volume.Name + " created.");
			$route.reload();
		})
		.catch(function(e) {
			toaster.pop('error', "Error", "Volume " + volume.Name + " cannot be created.");
		})
	};

	$scope.remove = function(volumes) {
		for (var i = 0; i < volumes.length; i++) {
			if (volumes[i].select) {
				var volume = volumes[i];
				removeHandler(volume);
			}
		}
	}
	
	function removeHandler(volume) {
		volumeApi.remove(volume.Name)
			.then(function(response) {
				toaster.pop('success', "Success", "volume " + volume.Name + " removed.");
				$route.reload();
			})
			.catch(function(e) {
				console.log(e);
				toaster.pop('error', "Error", "volume " + volume.Name + " cannot be removed.");
			})
	}
}
