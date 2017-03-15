angular.module("inoxica")
.controller("EditarOrdenCompraDetalleCtrl", EditarOrdenCompraDetalleCtrl);  
function EditarOrdenCompraDetalleCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);
window.rc = rc;


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
	return [{_id : $stateParams.ordenCompra_id}] 
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
   

    this.ordenCompra = {};
    this.ordenCompra.detalle = this.cotizacion
     rc.productoSeleccionado = {};

    
     
  
	this.helpers({
	  ordenCompra : () => {
		  return OrdenCompra.findOne({_id : $stateParams.ordenCompra_id});
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
	    ordenes : () => {
		 var ordenes = orden = OrdenCompra.findOne({_id : $stateParams.ordenCompra_id});
		  	if (ordenes) {
		  		_.each(ordenes, function(orden){
		  			orden.proveedor = Proveedores.findOne(orden.proveedor_id)

		  	});
	  	}
	  	console.log(ordenes);
		  return ordenes;
	  },
	   orden : () => {
		  return OrdenCompra.findOne();
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
		console.log(this.cotizacion)
		cotizacionManual.tipo = "manual";
		this.ordenCompra.detalle.push(cotizacionManual);
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
		this.ordenCompra.detalle.push(cotizacionProducto);
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
		_.each(rc.ordenCompra.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		_.each(rc.ordenCompra.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		 var total = 0;
		_.each(rc.ordenCompra.detalle,function(detalle){ total +=
		 ((detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		_.each(rc.ordenCompra.detalleProducto,function(producto){total += producto.precio * producto.cantidad});
		this.cotizacion.subTotal = total;
		this.cotizacion.total = total - total*0.16;
		this.cotizacion.nombrePrimerProducto = this.cotizacion.detalle[0].nombre 
		this.cotizacion.estado = true;			
		OrdenCompra.insert(this.cotizacion);
		toastr.success('Cotizacion guardada.');
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
    this.cotizacion = OrdenCompra.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};




	this.editarOrden = function($index)
	{

    this.cotizacionManual = rc.ordenCompra.detalle[$index];
    this.productoSeleccionado = rc.ordenCompra.detalle[$index];

    this.agregar = false;
    this.cancelar = true;
       this.action = false;
    this.productoIndice = $index;
    console.log(this.productoSeleccionado);

	};

		this.actualizarProducto= function(producto)
	{
		console.log(this.producto);
		_.each(rc.ordenCompra.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.ordenCompra.detalle[this.productoIndice] = producto;
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	    this.action = true;
	
	};



	
	this.actualizar = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.ordenCompra.detalle, function(orden){
			delete orden.$$hashKey;
			});	
		var idTemp = cotizacion._id;
		delete cotizacion._id;		
		OrdenCompra.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
		$state.go('root.ordenCompra')
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
		_.each(rc.ordenCompra.detalle,function(detalle){ total += (
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









