angular.module("inoxica")
.controller("UsuariosCtrl", UsuariosCtrl);
function UsuariosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {
let rc =$reactive(this).attach($scope);
window.rc = rc;

this.usuario = {};
    this.subscribe('usuarios',()=>{
	return [{"profile.estatus":true}] 
    });

    this.subscribe('empresas',()=>{
	return [{estatus:true}] 
    });
	
  this.action = true;
 
  this.helpers({
	  usuarios : () => {
		  return Meteor.users.find();
	  },
	  empresas : () => {
		  return Empresas.find();
	  },
		// Meteor.users : () => {
		//   return Meteor.users.find();
	 //  }
  });
  
  this.nuevo = true;  
  this.nuevoUsuario = function()
  {
	this.action = true;
    this.nuevo = !this.nuevo;
      this.usuario.profile = {};
  };

	 this.guardar = function (usuario) {



	 // 	alumno.profile.estatus = true;
		// var nombre = alumno.profile.nombre != undefined ? alumno.profile.nombre + " " : "";
		// var apPaterno = alumno.profile.apPaterno != undefined ? alumno.profile.apPaterno + " " : "";
		// var apMaterno = alumno.profile.apMaterno != undefined ? alumno.profile.apMaterno : "";
		// alumno.profile.nombreCompleto = nombre + apPaterno + apMaterno;
		// alumno.profile.fechaCreacion = new Date();
		// alumno.profile.campus_id = Meteor.user().profile.campus_id;
		// alumno.profile.seccion_id = Meteor.user().profile.seccion_id;
		// alumno.profile.usuarioInserto = Meteor.userId();
		// console.log(alumno);



		usuario.profile.estatus = true;
		var nombre = usuario.profile.nombre != undefined ? usuario.profile.nombre + " " : "";
		var apPaterno = usuario.profile.apPaterno != undefined ? usuario.profile.apPaterno + " " : "";
		var apMaterno = usuario.profile.apMaterno != undefined ? usuario.profile.apMaterno : ""
		this.usuario.profile.nombreCompleto = nombre + apPaterno + apMaterno;
			Meteor.call('crearUsuario', rc.usuario, 'usuario');
			toastr.success('usuario guardado.');
			$state.go('root.usuarios');			
		 	this.usuario = {};
		 	$('.collapse').collapse('hide');
		 	this.nuevo = true;
		 	console.log(rc.usuario);	

	};
	
	this.editar = function(usuario_id)
	{
		console.log(usuario_id);
    rc.usuario = Meteor.users.findOne(usuario_id);
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(usuario)
	{

		Meteor.call('actualizarUsuario', rc.usuario, "usuario");
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
		$state.go('root.usuarios');
	};
	
	
	// this.actualizar = function(usuario)
	// {
	// 	var idTemp = usuario._id;
	// 	delete usuario._id;		
	// 	Meteor.users.update({_id:idTemp},{$set:usuario});
	// 	$('.collapse').collapse('hide');
	// 	this.nuevo = true;
	// };
		
	this.cambiarEstatus = function(id)
	{
		var usuario = Meteor.users.findOne({_id:id});
		if(usuario.estatus == true)
			usuario.estatus = false;
		else
			usuario.estatus = true;
		
		Meteor.users.update({_id:id}, {$set : {estatus : usuario.estatus}});
	};

	 this.tomarFoto = function () {
		$meteor.getPicture().then(function(data){			
			rc.usuario.profile.fotografia = data;
		})
	};


};