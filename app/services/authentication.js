'use strict';

angular.module('uiForDocker')
  .service('authentication', function($http, $cookieStore) {
    var authApi = {};
    var isLogged = false;

    authApi.isLoggedIn = function() {
      return isLogged;
    };

    authApi.setIslogged = function(state) {
      isLogged = state;
    };

		authApi.getToken = function() {

      var token;

      if ($cookieStore.get('Gantry')) {
        token = $cookieStore.get('Gantry').data.token;
      }
      return token;
    };

    authApi.getUser = function() {
      var user;

      if ($cookieStore.get('Gantry')) {
        user = $cookieStore.get('Gantry').user;
      }
      return user;
    };

		authApi.loginUser = function(user) {
      return $http.post('api/users/authenticate', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    };

    return authApi;
  });
