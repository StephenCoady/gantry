angular.module('uiForDocker')
.controller('DockerCtrl', DockerCtrl);

DockerCtrl.$inject = ['$scope', '$http']; 

function DockerCtrl($scope, $http) {
	$scope.test = 'DOCKER PAGE';
}
