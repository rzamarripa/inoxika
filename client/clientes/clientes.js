angular.module("inoxica")
.controller("ClientesCtrl", ClientesCtrl);  
function ClientesCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
$reactive(this).attach($scope);

	this.subscribe('clientes',()=>{
	return [{estatus:true}] 
    });

 
	
  this.action = true;
  
	this.helpers({
	  clientes : () => {
		  return Clientes.find();
	  },
	
  });
  
	this.nuevo = true;  	  
  this.nuevoCliente = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.cliente = {};		
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
    this.cliente = Clientes.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
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
		
};
