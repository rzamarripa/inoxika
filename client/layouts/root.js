angular.module("inoxica").controller("RootCtrl", ['$scope', '$meteor', function ($scope, $meteor)
{
  $scope.isLoggedIn = function(){
	  return Meteor.user();
  } 
}]);