angular.module('uiForDocker')
.controller('ContainersCtrl', ContainersCtrl);

ContainersCtrl.$inject = ['$scope', '$http', '$location']; 

function ContainersCtrl($scope, $http, $location) {
	$scope.isActive = function(route) {
			return route === $location.path();
	}}
