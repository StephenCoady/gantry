angular.module('uiForDocker')
.controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['$scope', '$http']; 

function SettingsCtrl($scope, $http) {
	$scope.test = 'SETTINGS PAGE';
}
