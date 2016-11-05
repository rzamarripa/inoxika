angular.module("inoxica")
.controller("EditarClienteCtrl", EditarClienteCtrl);  
function EditarClienteCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc =$reactive(this).attach($scope);


this.contactoIndice = 0;
	this.subscribe('clientes', () => {
		return [{id : $stateParams.cliente_id,}];
	});

	console.log($stateParams);

	this.helpers({
	  cliente : () => {
			return Clientes.findOne({_id : $stateParams.cliente_id});
		},
  });



	
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
   	this.contactoSeleccionado = {};
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
		// _.each(rc.cliente.contactos, function(cliente){
		// 	delete cliente.$$hashKey;
		// 	});	
		
		rc.cliente.contactos.push(contacto);
		toastr.success('contacto agregado.');
		this.cliente.estatus = 1;
		console.log(this.cliente);
		this.guardar = false;
		this.add= false;	 
		this.contactoSeleccionado = {};
	};

  this.modificarContacto = function(contacto)
	{
	  rc.cliente.contactos.push = (contacto);
	  this.contactoSeleccionado = {};
	  $('.collapse').collapse('hide');
	  this.actualContacto = true
	  this.add = false; 
	  this.new = true;
	};

  
  this.guardarCliente = function(cliente)
	{
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


	// this.editarMaterial = function($index)
	// {
	//     this.materialSeleccionado = rc.producto.detalleProducto[$index];
	//     //this.materialSeleccionado._id = _id;
	//     $('.collapse').collapse('show');
	//     this.new = true;
	//     this.agregar = false;
	//     this.cancelar = true;
	//     this.materialIndice = $index;
	//     console.log(this.materialSeleccionado);

	// };



	
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

	this.cambiarEstatus = function(id)
	{
		var cliente = Clientes.findOne({_id:id});
		if(cliente.estatus == true)
			cliente.estatus = false;
		else
			cliente.estatus = true;
		
		Clientes.update({_id: id},{$set :  {estatus : cliente.estatus}});
    };
		
};
