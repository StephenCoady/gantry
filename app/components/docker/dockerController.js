angular.module('uiForDocker')
.controller('DockerCtrl', DockerCtrl);

DockerCtrl.$inject = ['$scope', '$http', 'dockerApi']; 

function DockerCtrl($scope, $http, dockerApi) {
	dockerApi.getInfo().then(function(res) {
		console.log(res);
		$scope.cpus = res.data.info.NCPU;//
		$scope.architecture = res.data.info.Architecture;//
		$scope.os = res.data.info.OSType;//
		$scope.serverVersion = res.data.info.ServerVersion;//
		$scope.driver = res.data.info.Driver;
		$scope.operatingSystem = res.data.info.OperatingSystem;
		$scope.dockerRootDir = res.data.info.DockerRootDir;
		$scope.name = res.data.info.Name;
		$scope.kernel = res.data.info.KernelVersion;
	}, function(error) {})
}
