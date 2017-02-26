angular.module('uiForDocker')
.controller('NetworkCtrl', NetworkCtrl);

NetworkCtrl.$inject = ['$scope', '$http', 'networkApi', '$filter', '$routeParams']; 

function NetworkCtrl($scope, $http, networkApi, $filter, $routeParams) {
	
	networkApi.getOne($routeParams.Id).then(function(response) {
		
		$scope.network = response.data.network;

	}, function(error) {});
	
	$scope.remove = function(network) {
		for (var i = 0; i < network.length; i++) {
			if (network[i].select) {
				var image = network[i];
				removeHandler(network);
			}
		}
	}
	
	function removeHandler(network) {
		networkApi.remove(network.Id)
			.then(function(response) {
				toaster.pop('success', "Success", "Network " + network.Id.substring(0, 15) + " removed.");
				$route.reload();
			})
			.catch(function(e) {
				toaster.pop('error', "Error", "Network " + network.Id.substring(0, 15) + " cannot be removed.");
			})
	}
}
