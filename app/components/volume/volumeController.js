angular.module('uiForDocker')
.controller('VolumeCtrl', VolumeCtrl);

VolumeCtrl.$inject = ['$scope', '$http', 'volumeApi', '$filter', '$routeParams']; 

function VolumeCtrl($scope, $http, volumeApi, $filter, $routeParams) {
	
	volumeApi.getOne($routeParams.Id).then(function(response) {
		
		$scope.volume = response.data.volume;

	}, function(error) {});
}
