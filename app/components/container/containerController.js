angular.module('uiForDocker')
.controller('ContainerCtrl', ContainerCtrl);

ContainerCtrl.$inject = ['$scope', '$http']; 

function ContainerCtrl($scope, $http) {
	$scope.test = 'CONTAINER PAGE';
}
