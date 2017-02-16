angular.module('uiForDocker')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', '$http']; 

function MainCtrl($scope, $http) {
	$scope.test = 'MAIN CONTROLLER';
}
