angular.module('uiForDocker')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', '$http', '$route', '$location']; 

function MainCtrl($scope, $http, $route, $location) {
	$scope.test = 'MAIN CONTROLLER';
	$scope.isActive = function(route) {
			return route === $location.path();
	}
}
