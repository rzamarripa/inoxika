angular.module("inoxica")
.controller("EditarOrdenProduccionCtrl", EditarOrdenProduccionCtrl);  
function EditarOrdenProduccionCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);


    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });
     this.subscribe('cotizacion',()=>{
	return [{estatus:1}] 
    });
      this.subscribe('clientes',()=>{
	return [{estatus:true}] 
    });
         this.subscribe('ordenProduccion',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('productos',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('unidades',()=>{
	return [{estatus:true}] 
    });
      this.subscribe('proveedores',()=>{
	return [{estatus:true}] 
    });

    console.log($stateParams)
    var cantidad = $stateParams.cantidad
   

    this.ordenProduccion = {};
    this.ordenProduccion.detalle = this.cotizacion
    
     
  
	this.helpers({
	  cotizacion : () => {
		  return Cotizacion.findOne({_id : $stateParams.ordenProduccion_id});
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
	   proveedores : () => {
		  return Proveedores.find();
	  },

  });
  

	this.nuevo = true;
	this.guardar = true; 
	this.tabla 	= false; 
	this.agregar = true;

	
	  this.action = true;
	 
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

	 this.guardarCotizacion = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		_.each(rc.ordenProduccion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		 var total = 0;
		_.each(rc.cotizacion.detalle,function(detalle){ total +=
		 ((detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		_.each(rc.cotizacion.detalleProducto,function(producto){total += producto.precio * producto.cantidad});
		this.cotizacion.subTotal = total;
		this.cotizacion.total = total - total*0.16;
		this.cotizacion.nombrePrimerProducto = this.cotizacion.detalle[0].nombre 
		this.cotizacion.estado = true;			
		OrdenProduccion.insert(this.cotizacion);
		toastr.success('orden guardada.');
		this.cotizacion = {};
		this.cotizacionProducto = {};
     	this.cotizacion.detalle = [];
    	this.cotizacionManual = {};  
    	this.clienteSeleccionado = {};
        this.productoSeleccionado = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
		this.guardar = true; 
		this.productoTipo = true;
		this.tabla = false;
		$state.go('root.ordenProduccion')
	};
	
	this.editar = function(id)
	{
    this.cotizacion = Cotizacion.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};




	this.editarOrden = function($index)
	{

    this.cotizacionManual = rc.cotizacion.detalle[$index];
    this.productoSeleccionado = rc.cotizacion.detalle[$index];

    this.agregar = false;
    this.cancelar = true;
    this.productoIndice = $index;
    console.log(this.productoSeleccionado);

	};

		this.actualizarProducto= function(cotizacion)
	{


		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.cotizacion.detalle[this.productoIndice] = cotizacion;
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	    this.agregar = true;
	
	};



	
	this.actualizar = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		_.each(rc.ordenProduccion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		var idTemp = cotizacion._id;
		delete cotizacion._id;	

		this.cotizacion.nombrePrimerProducto = this.cotizacion.detalle[0].nombre	
		OrdenProduccion.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
		$state.go('root.ordenProduccion')
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

	this.SumaPrecioProductos = function(){
		total = 0;
		_.each(rc.cotizacion.detalle,function(detalle){ total += (
		(detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		return total
	};


	this.aumentoIva = function () 
	{
		this.on = !this.on;

		console.log(this.on)		
		
   };

       this.getProveedor= function(proveedor_id)
	{
		var proveedor = Proveedores.findOne(proveedor_id);
		if(proveedor)
		return proveedor.nombre;
	};




};









