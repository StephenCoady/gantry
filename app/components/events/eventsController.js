angular.module('uiForDocker')
  .controller('EventsCtrl', EventsCtrl);

EventsCtrl.$inject = ['$scope', '$http', 'dockerApi', '$filter'];

function EventsCtrl($scope, $http, dockerApi, $filter) {
  dockerApi.getEvents().then(function(response) {
    $scope.events = [];
    var records = response.data.events.split('\n').map(function(record) {
      if (record !== "") {
        $scope.events.push(JSON.parse(record));
      }
    })
  }).then(function(){
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.q = '';
		$scope.getData = function() {
			return $filter('filter')($scope.events, $scope.q)
		}
		$scope.numberOfPages = function() {
      let pages = Math.ceil($scope.getData().length / $scope.pageSize);
      if(pages){
        return pages;
      } else {
        return 1;
      }		
    }

		$scope.$watch('q', function(newValue, oldValue) {
			if (oldValue != newValue) {
				$scope.currentPage = 0;
			}
		}, true);
	})
}
