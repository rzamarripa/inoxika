angular.module("inoxica")
.controller("CotizacionCtrl", CotizacionCtrl);  
function CotizacionCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);


    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });
     this.subscribe('cotizacion',()=>{
	return [{estatus:true}] 
    });
      this.subscribe('clientes',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('productos',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('unidades',()=>{
	return [{estatus:true}] 
    });

      this.cotizacion = {};
      this.cotizacionProducto = {};
      this.cotizacion.detalle = [];
      this.cotizacion.detalleDelProducto = [];
      this.subTotal = 0.00;

 this.clienteSeleccionado = {};
 this.productoSeleccionado = {};
	
  this.action = true;
  
	this.helpers({
	  cotizaciones : () => {
		  return Cotizacion.find();
	  },
	  cotizacionesProductos : () => {
		  return Cotizacion.find({tipo : "producto" });
	  },
	  materiales : () => {
		  return Materiales.find();
	  },
	   clientes : () => {
		  return Clientes.find();
	  },
	  productos : () => {
		  return Productos.find();
	  },
	   unidades : () => {
		  return Unidades.find();
	  },
	
  });
    // this.CotizacionProducto = function()
  // {
    
  //   this.cotizacionProducto = {};
  //    this.cotizacion.detalle = [];
  //   this.cotizacionManual = {};			
  // };
  // this.CotizacionManual = function()
  // {

  //   this.cotizacionManual = {};	
  //   this.cotizacionProducto = {};	
  // };
  
	this.nuevo = true;
	this.guardar = true;  	  
  this.nuevoCotizacion = function()
  {
    this.action = true;
    this.productoTipo = true;
    this.nuevo = !this.nuevo;
    this.cotizacion = {};
    this.cotizacion.detalle = [];
  };

  
  this.agregarManual = function(cotizacionManual)
	{ 
		//cotizacion.material_id = this.material_id;
		cotizacionManual.tipo = "manual";
		this.cotizacion.detalle.push(cotizacionManual);
		this.cotizacion.detalleDelProducto = [];
		this.cotizacion.estatus = 1;
		console.log(this.cotizacion);
		this.guardar = false; 
		this.subTotal += cotizacionManual.precio;
	};
	this.agregarProducto = function(cotizacionProducto)
	{ 
		//cotizacion.material_id = this.material_id;
		cotizacionProducto.tipo = "producto";
		this.cotizacion.detalle.push(cotizacionProducto);
		this.cotizacion.estatus = 1;
		console.log(this.cotizacion);
		this.guardar = false; 
		this.productoTipo = false;
		_.each(cotizacionProducto.detalle, function(detalle){
			rc.subTotal += detalle.precio;
		})
	};

	 this.guardarCotizacion = function(cotizacion)
	{
		
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
			_.each(cotizacion.detalleDelProducto, function(cot){
				delete cot.$$hashKey;
				_.each(cot.detalleProducto, function(ct){
				delete ct.$$hashKey;

			});

			});


		

		_.each(rc.cotizacion.detalleDelProducto, function(cotizacion){
			delete cotizacion.$$hashKey;
			_.each(cotizacion.detalle, function(cot){
				delete cot.$$hashKey;

			});
		});	
			
		Cotizacion.insert(this.cotizacion);
		toastr.success('Cotizacion guardada.');
		this.cotizacion = {};
		this.cotizacionProducto = {};
     	this.cotizacion.detalle = [];
     	this.cotizacion.detalleDelProducto = [];
    	this.cotizacionManual = {};  
    	this.clienteSeleccionado = {};
        this.productoSeleccionado = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
		this.guardar = true; 
		this.productoTipo = true;
		this.tabla = false;
	};
	
	this.editar = function(id)
	{
    this.cotizacion = Cotizacion.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(cotizacion)
	{
		var idTemp = cotizacion._id;
		delete cotizacion._id;		
		Cotizacion.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
	};

	this.cambiarEstatus = function(id)
	{
		var cotizacion = Cotizacion.findOne({_id:id});
		if(cotizacion.estatus == 1)
			cotizacion.estatus = 2;
		else
			cotizacion.estatus = 3;
		
		Cotizacion.update({_id: id},{$set :  {estatus : cotizacion.estatus}});
    };

    this.getProductos= function(producto_id)
	{
		console.log(producto_id);
		rc.productoSeleccionado = Productos.findOne(producto_id);
		console.log(rc.productoSeleccionado)
	};
	this.clientillo = false;
	this.getClientes= function(cliente_id)
	{
		 rc.clienteSeleccionado = Clientes.findOne(cliente_id);
		 this.clientillo = true;

	};
	this.tabla = false
	this.Mostrartabla= function()
	{
		 
		 this.tabla = true;

	};
		
};