angular.module("inoxica").run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    switch(error) {
      case "AUTH_REQUIRED":
        $state.go('anon.login');
        break;
      case "FORBIDDEN":
        //$state.go('root.home');
        break;
      case "UNAUTHORIZED":
      	toastr.error("Acceso Denegado");
				toastr.error("No tiene permiso para ver esta opción");
        break;
      default:
        $state.go('internal-client-error');
    }
/*
    if (error === 'AUTH_REQUIRED') {
      $state.go('anon.login');
    }
*/
  });
});

angular.module('inoxica').config(['$injector', function ($injector) {
  var $stateProvider = $injector.get('$stateProvider');
  var $urlRouterProvider = $injector.get('$urlRouterProvider');
  var $locationProvider = $injector.get('$locationProvider');

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  /***************************
   * Anonymous Routes
   ***************************/
  $stateProvider
    .state('anon', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })
    .state('anon.login', {
      url: '/login',
      templateUrl: 'client/login/login.ng.html',
      controller: 'LoginCtrl',
      controllerAs: 'lc'
    })
    .state('anon.logout', {
      url: '/logout',
      resolve: {
        'logout': ['$meteor', '$state', 'toastr', function ($meteor, $state, toastr) {
          return $meteor.logout().then(
            function () {
	            toastr.success("Vuelva pronto.");
              $state.go('anon.login');
            },
            function (error) {
              toastr.error(error.reason);
            }
          );
        }]
      }
    });

  /***************************
   * Login Users Routes
   ***************************/
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'client/layouts/root.ng.html',
      controller: 'RootCtrl',
    })
    .state('root.home', {
      url: '/',
      templateUrl: 'client/home/home.ng.html',      
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.estadisticas', {
      url: '/',
      templateUrl: 'client/estadisticas/estadisticas.ng.html',
      controller: 'EstadisticasCtrl as est',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
/*
    .state('root.estadisticas', {
      url: '/estadisticas',
      templateUrl: 'client/estadisticas/estadisticas.ng.html',
      controller: 'EstadisticasCtrl as est',
    })
*/
    
    .state('root.materiales', {
      url: '/materiales',
      templateUrl: 'client/materiales/materiales.ng.html',
      controller: 'MaterialesCtrl as mat',
    })
     .state('root.clientes', {
      url: '/clientes',
      templateUrl: 'client/clientes/clientes.ng.html',
      controller: 'ClientesCtrl as cl',
    })
      .state('root.productos', {
      url: '/productos',
      templateUrl: 'client/productos/productos.ng.html',
      controller: 'ProductosCtrl as pro',
    })
      .state('root.cotizacion', {
      url: '/cotizacion',
      templateUrl: 'client/cotizacion/cotizacion.ng.html',
      controller: 'CotizacionCtrl as cot',
    })
 
    .state('root.usuarios', {
      url: '/usuarios',
      templateUrl: 'client/usuarios/usuarios.ng.html',
      controller: 'UsuariosCtrl as usu',

    })
       .state('root.partidas', {
      url: '/partidas/:id',
      templateUrl: 'client/partidas/partidas.ng.html',
      controller: 'PartidasCtrl as par',
    })
         .state('root.unidades', {
      url: '/unidades/',
      templateUrl: 'client/unidades/unidades.ng.html',
      controller: 'UnidadesCtrl as uni',
    })


      .state('root.costosDirectos', {
      url: '/costosDirectos/:id',
      templateUrl: 'client/costosDirectos/costosDirectos.ng.html',
      controller: 'CostosDirectosCrtl as cd',
    });
}]);     