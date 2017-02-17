angular.module('uiForDocker')
.controller('HostCtrl', HostCtrl);

HostCtrl.$inject = ['$scope', '$http']; 

function HostCtrl($scope, $http) {
	$scope.test = 'HOST PAGE';
}
