Meteor.methods({

	  createUsuario: function (usuario, rol,) {
	  console.log(usuario);
	  console.log(rol);
	  profile = {
				email: usuario.correo,
				nombre: usuario.nombre,
				apellidos: usuario.apPaterno + " " + usuario.apMaterno,
				nombreCompleto : usuario.nombre  + " " + usuario.apPaterno + " " + (usuario.apMaterno ? usuario.apMaterno : ""),
				fotografia : usuario.fotografia,
				estatus:true
			}
		var usuario_id = Accounts.createUser({
			username: usuario.nombreUsuario,
			password: usuario.contrasena,			
			profile: profile
		});
		
		Roles.addUsersToRoles(usuario_id, rol);
		
	},

	crearUsuario: function (usuario, rol) {
	  console.log(usuario.profile);
	  console.log(rol);
	  
		if(usuario.empresa_id != undefined)
			profile.empresa_id = usuario.empresa_id;
		
		var usuario_id = Accounts.createUser({
			username: usuario.username,
			password: usuario.password,			
			profile: usuario.profile
		});
		
		Roles.addUsersToRoles(usuario_id, rol);
		
	},

	actualizarUsuario: function (usuario, rol) {

		var idTemp = usuario._id;
	 	delete usuario._id;		
	  Meteor.users.update({_id: idTemp}, {$set:{
			username: usuario.username,
			roles: [rol],
			profile: usuario.profile
		}});
		
		//Accounts.setPassword(idTemp, usuario.password, {logout: false});		
	},

	crearEmpresa: function (usuario, rol) {
	  console.log(usuario.perfil);
	  console.log(rol);
	  
		if(usuario.empresa_id != undefined)
			perfil.empresa_id = usuario.empresa_id;
		
		var usuario_id = Accounts.createUser({
			username: usuario.username,
			password: usuario.password,			
			perfil: usuario.perfil
		});
		
		Roles.addUsersToRoles(usuario_id, rol);
		
	},

	actualizarPerfil: function (usuario, rol) {

		var idTemp = usuario._id;
	 	delete usuario._id;		
	  Meteor.users.update({_id: idTemp}, {$set:{
			username: usuario.username,
			roles: [rol],
			perfil: usuario.perfil
		}});
		
		//Accounts.setPassword(idTemp, usuario.password, {logout: false});		
	},

 
	userIsInRole: function(usuario, rol, grupo, vista){
		if (!Roles.userIsInRole(usuario, rol, grupo)) {
	    throw new Meteor.Error(403, "Usted no tiene permiso para entrar a " + vista);
	  }
	},
	cambiarEstatusUsuario : function(usuario_id){
		var usuario = Meteor.users.findOne({_id:usuario_id});
		var estatus = false;
		if(usuario.profile.estatus == true)
			estatus = false;
		else
			estatus = true;
		Meteor.users.update({_id:usuario_id}, {$set : {'profile.estatus' : estatus}});
	}
});