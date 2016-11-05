angular.module("inoxica")
.controller("ClientesCtrl", ClientesCtrl);  
function ClientesCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc =$reactive(this).attach($scope);

	this.subscribe('clientes');
	
    this.action = true;
    this.act = true;
    this.formContactos = false;

    this.contactosSeleccionados = [];



  
	this.helpers({
	  clientes : () => {
		  return Clientes.find().fetch();
	  },
	
  });


   this.modal = function(contactos)
   {
   	 this.contactosSeleccionados = contactos;
   	 $('#myModal').modal('show');
   }

  this.nuevoCliente = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.cliente = {};	
    this.cliente.contactos = [];	
  };
  
  this.nuevoObra = function()
  {
   	this.add= true;
   	this.act = true;
   	this.contactoSeleccionado = {};
  };

   this.agregarContacto = function(contacto)
	{ 
		
		console.log(this.contacto)
		
		this.cliente.contactos.push(contacto);
		this.cliente.estatus = 1;
		console.log(this.cliente);
		this.guardar = false;
		this.add= false;	 
		this.contactoSeleccionado = {};
	};
  
  this.guardar = function(cliente)
	{
		this.cliente.estatus = true;
		console.log(this.cliente);
		Clientes.insert(this.cliente);
		toastr.success('cliente guardado.');
		this.cliente = {}; 
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
	$state.go('root.clientesDetalle');
    this.cliente = Clientes.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};






	this.editarContactos = function($index,contactos)
	{
    this.contactoSeleccionados = rc.cliente.contactos[$index];

    this.formContactos = true;
	};


	this.editarMaterial = function($index)
	{

    this.materialSeleccionado = rc.producto.detalleProducto[$index];

    //this.materialSeleccionado._id = _id;

    this.agregar = false;
    this.cancelar = true;
    this.materialIndice = $index;
    console.log(this.materialSeleccionado);

	};

	this.actualizar = function(cliente)
	{
		var idTemp = cliente._id;
		delete cliente._id;		
		Clientes.update({_id:idTemp},{$set:cliente});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cliente);
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

     this.getCliente= function(cliente_id)
	{
		var cliente = Clientes.findOne(cliente_id);
		if(cliente)
		return cliente.nombre;
	};










		
};
