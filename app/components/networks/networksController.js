angular.module('uiForDocker')
.controller('NetworksCtrl', NetworksCtrl);

NetworksCtrl.$inject = ['$scope', '$http']; 

function NetworksCtrl($scope, $http) {
	$scope.test = 'NETWORKS PAGE';
}
