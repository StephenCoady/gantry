angular.module('uiForDocker')
  .controller('EventsCtrl', EventsCtrl);

EventsCtrl.$inject = ['$scope', '$http', 'dockerApi'];

function EventsCtrl($scope, $http, dockerApi) {
  dockerApi.getEvents().then(function(response) {
    $scope.events = response.data.events
		
    console.log($scope.events);
  })
}
