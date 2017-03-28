angular.module('uiForDocker')
  .controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', 'authentication', 'toaster'];

function SettingsCtrl($scope, $rootScope, $location, $cookieStore, authentication, toaster) {

  $scope.credentials = {};

  $scope.changePassword = function(credentials) {
    $scope.credentials = credentials;
    if (credentials.desired_password == credentials.desired_password_again) {
			authentication.changePassword({name: credentials.name, password: credentials.password, desired_password: credentials.desired_password})
			.then(function(data) {
				console.log("succ");
				toaster.pop('success', "Success", "Password successfully changed, please log in again.");
				$cookieStore.remove('Gantry', data);
				authentication.setIslogged(false);
				$rootScope.isLoggedIn = false;
				$location.path('/login');
			})
			.catch(function(error) {
				toaster.pop({
									type: 'error',
									title: 'Oops',
									body: 'Something went wrong',
									timeout: 10000,
									showCloseButton: true
							});
			});
    } else {
      toaster.pop({
        type: 'error',
        title: 'Oops',
        body: 'Your new password does not match',
        timeout: 10000,
        showCloseButton: true
      });
    }
  }
}
