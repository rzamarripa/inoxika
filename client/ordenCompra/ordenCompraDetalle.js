angular.module("inoxica")
.controller("OrdenCompraDetalleCtrl", OrdenCompraDetalleCtrl);  
function OrdenCompraDetalleCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
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
     this.subscribe('ordenCompra',()=>{
	return [{estatus:"pendiente"}] 
    });
     this.subscribe('ordenProduccion',()=>{
	return [{_id : $stateParams.ordenProduccion_id}] 
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
    rc.productoSeleccionado = {};
    
     
  
	this.helpers({
	  ordenProduccion : () => {
		  return OrdenProduccion.findOne({_id : $stateParams.ordenProduccion_id});
	  },
	  materiales : () => {
		  return Materiales.find();
	  },
	   clientes : () => {
		  return Clientes.find();
	  },
	  productos : () => {
		 var productos = Productos.find().fetch();
		  	if (productos) {
		  		_.each(productos, function(producto){
		  			producto.unidad = Unidades.findOne(producto.unidad_id)

		  	});
	  	}
	  	console.log(productos);
		  return productos;
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
	this.action = true;
	$(".js-example-basic-single").select2();
	 
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
		console.log(this.ordenProduccion)
		cotizacionManual.tipo = "manual";
		this.ordenProduccion.detalle.push(cotizacionManual);
		this.ordenProduccion.estatus = 1;
		console.log(this.ordenProduccion);
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
		this.ordenProduccion.detalle.push(cotizacionProducto);
		this.ordenProduccion.estatus = 1;
		console.log(this.ordenProduccion);
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
		_.each(rc.ordenProduccion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		_.each(rc.ordenProduccion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		 var total = 0;
		_.each(rc.ordenProduccion.detalle,function(detalle){ total +=
		 ((detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		_.each(rc.ordenProduccion.detalleProducto,function(producto){total += producto.precio * producto.cantidad});
		this.ordenProduccion.imprimir = true;
		this.ordenProduccion.subTotal = total;
		this.ordenProduccion.total = total - total*0.16;
		this.ordenProduccion.nombrePrimerProducto = this.ordenProduccion.detalle[0].nombre 
		this.ordenProduccion.estado = "pendiente";			
		OrdenCompra.insert(this.ordenProduccion);
		toastr.success('Orden guardada.');
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
		$state.go('root.ordenCompra')
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

    this.cotizacionManual = rc.ordenProduccion.detalle[$index];
    this.productoSeleccionado = rc.ordenProduccion.detalle[$index];

    this.agregar = false;
    this.cancelar = true;
    this.action = false;
    this.productoIndice = $index;
    console.log(this.productoSeleccionado);

	};

		this.actualizarProducto= function(producto)
	{
		console.log(this.producto);
		this.action = true;
		_.each(rc.ordenProduccion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.ordenProduccion.detalle[this.productoIndice] = producto;
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
		var cotizacion = OrdenProduccion.findOne({_id:id});
		if(cotizacion.estatus == 1)
			cotizacion.estatus = 2;
		else
			cotizacion.estatus = 3;
		
		Cotizacion.update({_id: id},{$set :  {estatus : cotizacion.estatus}});
    };

     this.getProductos= function(producto_id)
		{
		
	     	_.each(rc.productos, function(producto){
	     		delete producto.$$hashKey;

	     	});

			console.log(producto_id);
			rc.productoSeleccionado = Productos.findOne(producto_id);
			rc.productoSeleccionado.unidad = Unidades.findOne(rc.productoSeleccionado.unidad_id);
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
		_.each(rc.ordenProduccion.detalle,function(detalle){ total += (
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

	this.eliminarOrden = function($index)
	{
		rc.ordenProduccion.detalle.splice($index, 1);
    };




};









