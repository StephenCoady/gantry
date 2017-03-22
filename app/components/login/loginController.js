angular.module('uiForDocker')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$rootScope', '$location', '$cookieStore', 'authentication', 'toaster'];

function LoginCtrl($scope, $rootScope, $location, $cookieStore, authentication, toaster) {
  
  $scope.credentials = {};

  $scope.login = function(){
    authentication.loginUser({
      'name': $scope.credentials.name,
      'password': $scope.credentials.password
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

  

  $scope.signup = function(){
    $location.path('/signup');  
  };
  $scope.resetPassword = function(){
   $location.path('/forgotpassword');
 };
}
