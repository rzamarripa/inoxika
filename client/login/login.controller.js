angular.module('inoxica').controller('LoginCtrl', ['$injector', function ($injector) {
  var $meteor = $injector.get('$meteor');
  var $state 	= $injector.get('$state');
  var toastr 	= $injector.get('toastr');
  this.credentials = {
    username: '',
    password: ''
  };
  this.login = function () {
    $meteor.loginWithPassword(this.credentials.username, this.credentials.password).then(
      function () {
	      toastr.success("Bienvenido al Sistema");
        if(Meteor.user().roles[0] == "admin" )
        {
          $state.go('root.materiales'); 
        }else{
          $state.go('root.materiales'); 
        }
               
      },
      function (error) {
        toastr.error(error.reason);
      }
    )
  }
}]);