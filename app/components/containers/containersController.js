angular.module('uiForDocker')
.controller('ContainersCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', '$http']; 

function MainCtrl($scope, $http) {
	$scope.test = 'CONTAINERS PAGE';
}
