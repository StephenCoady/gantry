angular.module('uiForDocker')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', 'authentication', 'toaster'];

function LoginCtrl($scope, $rootScope, $location, $cookieStore, authentication, toaster) {
  
  $scope.credentials = {};

  $scope.login = function(credentials){
    $scope.credentials = credentials;
    authentication.loginUser({
      'name': credentials.name,
      'password': credentials.password
    })
    .then(function(data) {
      console.log("succ");

      $cookieStore.put('Gantry', data);
      authentication.setIslogged(true);
      $location.path('/');
    })
    .catch(function(error) {
      toaster.pop({
                type: 'error',
                title: 'Unauthorised',
                body: 'Invalid credentials',
                timeout: 10000,
                showCloseButton: true
            });
    });
  };
}
