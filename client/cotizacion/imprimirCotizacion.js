angular.module("inoxica")
.controller("ImprimirCotizacionCtrl", ImprimirCotizacionCtrl);  
function ImprimirCotizacionCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);


    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });
     this.subscribe('cotizacion',()=>{
	return [{estatus:1,cotizacion_id: this.getReactively('cotizacion_id'),}] 
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

    console.log($stateParams)
    var cantidad = $stateParams.cantidad

      this.cotizacion = {};
      this.cotizacion.detalle = [];
      this.subTotal = 0.00;
      this.productoIndice = 0;
	  this.productoSeleccionado = {};
	  this.cotizacionManual = {};
	  // this.productoSeleccionado = this.cotizacionManual;
     


  
	this.helpers({
	  cotizacion : () => {
		  return Cotizacion.findOne({_id : $stateParams.cotizacion_id});
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
  

  this.nuevo = true;
  this.guardar = true; 
  this.tabla 	= false; 
  this.action = true;
	

  
  this.agregarManual = function(cotizacionManual)
	{ 
		//cotizacion.material_id = this.material_id;
		console.log(this.cotizacion)
		cotizacionManual.tipo = "manual";
		this.cotizacion.detalle.push(cotizacionManual);
		this.cotizacion.estatus = 1;
		console.log(this.cotizacion);
		this.guardar = false; 
		this.productoTipo = false;
		this.on = false;
		this.tabla 	= true;
		this.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		this.cotizacionManual = {};
		//this.cotizacion.detalle = [];
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
			rc.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		});
		this.productoSeleccionado = {};
		//this.cotizacion.detalle  = [];
	};


	
	this.editar = function(id)
	{
    this.cotizacion = Cotizacion.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};


	this.editarProducto = function($index)
	{

    this.cotizacionManual = rc.cotizacion.detalle[$index];
    this.productoSeleccionado = rc.cotizacion.detalle[$index];

    this.agregar = false;
    this.cancelar = true;
    this.productoIndice = $index;
    console.log(this.productoSeleccionado);

	};

		this.actualizarProducto= function(producto)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.cotizacion.detalle[this.productoIndice] = producto;
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	
	};


	
	this.actualizar = function(cotizacion)
	{
		var idTemp = cotizacion._id;
		delete cotizacion._id;		
		Cotizacion.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
		$state.go('root.cotizacion')
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

	 this.getUnidad= function(unidad_id)
	{
		var unidad = Unidades.findOne(unidad_id);
		if(unidad)
		return unidad.nombre;
	}; 

	     this.getCliente= function(cliente_id)
	{
		var cliente = Clientes.findOne(cliente_id);
		if(cliente)
		return cliente.nombre;
	};
	    this.getClienteDireccion= function(cliente_id)
	{
		var cliente = Clientes.findOne(cliente_id);
		if(cliente)
		return cliente.direccion;
	};

	// this.SumaPrecioProductos = function(){
	// 	total = 0;
	// 	_.each(rc.cotizacion.detalle,function(detalle){ total += (
	// 	(detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
	// 	return total
	// };

	this.aumentoIva = function () 
	{
		this.on = !this.on;

		console.log(this.on)		
		
   };




};









