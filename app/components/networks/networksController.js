angular.module('uiForDocker')
.controller('NetworksCtrl', NetworksCtrl);

NetworksCtrl.$inject = ['$scope', '$http', 'networkApi', '$filter', 'toaster', '$route']; 

function NetworksCtrl($scope, $http, networkApi, $filter, toaster, $route) {
	networkApi.getAll().then(function(response) {
		$scope.networks = response.data.networks;
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.q = '';
		$scope.getData = function() {
			return $filter('filter')($scope.networks, $scope.q)
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
		angular.forEach($scope.networks, function(network) {
			network.select = $scope.selectAll;
		});
	};

	$scope.remove = function(networks) {
		for (var i = 0; i < networks.length; i++) {
			if (networks[i].select) {
				var network = networks[i];
				removeHandler(network);
			}
		}
	}
	
	function removeHandler(network) {
		networkApi.remove(network.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Network " + network.Name + " removed.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Network " + network.Name + " cannot be removed.");
			})
	}
}
