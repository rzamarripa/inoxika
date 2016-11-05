angular.module("inoxica")
.controller("ProveedoresCtrl", ProveedoresCtrl);  
function ProveedoresCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);

	this.subscribe('proveedores',()=>{
	return [{estatus:true}] 
    });

    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });

 this.proveedor = {}
	
  this.action = true;
  
	this.helpers({
	  proveedores : () => {
		  return Proveedores.find();
	  },
	  materiales : () => {
		  return Materiales.find();
	  },
	
  });
  
	this.nuevo = true;  	  
  this.nuevoProveedor = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.proveedor = {};
	
  };
  
	this.guardar = function(proveedor)
	{ 
	
		this.proveedor.estatus = true;
		console.log(this.proveedor);
		Proveedores.insert(this.proveedor);
		toastr.success('proveedor guardado.');
	     this.proveedor = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.proveedor = Proveedores.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(proveedor)
	{
		var idTemp = proveedor._id;
		delete proveedor._id;
		_.each(rc.proveedor.detalle, function(proveedor){
			delete proveedor.$$hashKey;
		});			
		Proveedores.update({_id:idTemp},{$set:proveedor});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(proveedor);
	};

	this.cambiarEstatus = function(id)
	{
		var proveedor = Proveedores.findOne({_id:id});
		if(proveedor.estatus == true)
			proveedor.estatus = false;
		else
			proveedor.estatus = true;
		
		Proveedores.update({_id: id},{$set :  {estatus : proveedor.estatus}});
    };

	this.getMateriales= function(material_id)
	{
		
		rc.materialSeleccionado = Materiales.findOne(material_id);
	};
	 this.obtenerMaterial= function(material_id)
	{
		var material = Materiales.findOne(material_id);
		if(material)
		return material.nombre;
	};
		
};
