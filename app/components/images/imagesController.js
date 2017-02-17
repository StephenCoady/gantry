angular.module('uiForDocker')
.controller('ImagesCtrl', ImagesCtrl);

ImagesCtrl.$inject = ['$scope', '$http']; 

function ImagesCtrl($scope, $http) {
	$scope.test = 'IMAGES PAGE';
}
