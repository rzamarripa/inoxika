angular.module("inoxica")
.controller("ClientesDetalleCtrl", ClientesDetalleCtrl);  
function ClientesDetalleCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc =$reactive(this).attach($scope);


this.contactoIndice = 0;
	this.subscribe('clientes', () => {
		return [{id : $stateParams.cliente_id,}];
	});

	console.log($stateParams);
  this.cliente = {};
  this.cliente.contactos = [];
  this.contactoSeleccionado = {};

	this.helpers({
	  cliente : () => {
			return Clientes.findOne({_id : $stateParams.cliente_id});
		},
  });

	this.cliente = {};

	this.cliente.contactos = [];
    this.contactoSeleccionado = {};

	
///////// VARIABLES ////////
	this.new = true; 
	this.add= false;   
	this.action = true;
    this.act = true;
    this.actualContacto = true;
	  
  this.nuevoCliente = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.cliente = {};	
    this.cliente.contactos = [];	
  };
  
  this.nuevoContacto = function()
  {
    
   	this.add= false;
   	this.new = !this.new;
 	
  };
  
  this.nuevu = function()
  {
  	if (rc.actualContacto == false) {
  		this.add= false;
  	}else{
  		this.add = true

  	}
   	
   	this.act = true;
  };

   this.agregarContacto = function(contacto)
	{ 
		//this.contactoSeleccionado=contacto;
		
		
		rc.cliente.contactos.push(contacto);
		toastr.success('contacto agregado.');
		contacto.estatus = true;
		console.log(this.cliente);
		this.guardar = false;
		this.add= false;	 
		this.contactoSeleccionado = {};
	};



  
  this.guardarCliente = function(cliente)
	{
		_.each(rc.cliente.contactos, function(cliente){
			delete cliente.$$hashKey;
			});	
		this.cliente.estatus = true;
		console.log(this.cliente);
		Clientes.insert(this.cliente);
		toastr.success('cliente guardado.');
		this.cliente = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
		$state.go('root.clientes');
	};
	
	this.editar = function(id)
	{
	    this.cliente = Clientes.findOne({_id:id});
	    this.action = false;
	    this.nuevo = false;
	};

	this.editarContactos = function($index)
	{
	    this.contactoSeleccionado = rc.cliente.contactos[$index];
	    this.new = false;
	    this.actualContacto = false;
	    this.add = false;
	    $('.collapse').collapse('show');
	    this.contactoIndice = $index;
	    console.log(this.contactoSeleccionado);

	};
	  this.modificarContacto = function(contacto)
		{
		  rc.cliente.contactos.push = (contacto);
		  this.contacto.estatus = true;
		  this.contactoSeleccionado = {};
		  $('.collapse').collapse('hide');
		  this.actualContacto = true
		  this.add = false; 
		  this.new = true;
		};
	
	this.actualizar = function(cliente)
	{
		_.each(rc.cliente.contactos, function(cliente){
	    delete cliente.$$hashKey;
		});	
		var idTemp = cliente._id;
		delete cliente._id;		
		Clientes.update({_id:idTemp},{$set:cliente});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cliente);
		$state.go('root.clientes')
		this.cliente = {}; 
	};

	this.cambiarEstatus = function(contacto)
	{
		var cliente = Clientes.findOne({_id:id});
		if(cliente.estatus == true)
			cliente.estatus = false;
		else
			cliente.estatus = true;
		
		Clientes.update({_id: id},{$set :  {estatus : cliente.estatus}});
    };




    this.eliminarContacto = function(contacto)
	{
	  
		if(contacto.estatus == true)
			contacto.estatus = false;
		else
			contacto.estatus = true;
		
    };
		
};
