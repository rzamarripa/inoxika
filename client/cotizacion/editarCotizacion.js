angular.module("inoxica")
.controller("EditarCotizacionDetalleCtrl", EditarCotizacionDetalleCtrl);  
function EditarCotizacionDetalleCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
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
    this.subscribe('productos',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('unidades',()=>{
	return [{estatus:true}] 
    });

    this.subscribe('notas',()=>{
	return [{estatus:true}] 
    });

    console.log($stateParams)
    var cantidad = $stateParams.cantidad
      
      this.cliente = {}
      this.cotizacion = {};
      this.cotizacion.detalle = [];
      this.subTotal = 0.00;
      this.productoIndice = 0;
	  this.productoSeleccionado = {};
	  this.cotizacionManual = {};
	  this.cotizacionManual.utilidad = this.cliente.utilidad
	  this.productoSeleccionado.utilidad = this.cliente.utilidad
	  this.nota = {};

	  

     


  
	this.helpers({
	  cotizacion : () => {
		  return Cotizacion.findOne({_id : $stateParams.cotizacion_id});
	  },
	  cotizacionProductos : () => {
		  return Cotizacion.find({tipo : "producto" });
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
	     notas : () => {
		  return Notas.find();
	  },

  });
  

  this.nuevo = true;
  this.guardar = true; 
  this.tabla 	= false; 
  this.action = true;
  this.notasText = false;
  this.comboNota = true;


  $(".js-example-basic-single").select2();
	

  
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
    this.action = false;
    this.productoIndice = $index;
    console.log(this.productoSeleccionado);

	};


	this.eliminarProducto = function($index)
	{
		rc.cotizacion.detalle.splice($index, 1);
    };



		this.actualizarProducto= function(producto)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.cotizacion.detalle[this.productoIndice] = producto;
		this.action = true;
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	
	};


	
	this.actualizar = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});
		this.productoSeleccionado.utilidad = this.cliente.utilidad
		var idTemp = cotizacion._id;
		delete cotizacion._id;		
		Cotizacion.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
		$state.go('root.cotizacionPendiente')
	};
	this.actualizarNota = function(nota,cotizacion)
	{

		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});


		console.log("nota lo que tiene",nota);
		var idTemp = nota._id;
		delete nota._id;	
		console.log("el id de la nota",idTemp)	
		this.notasText = false

		Notas.update({_id:idTemp},{$set:nota});
		console.log(nota);
		toastr.success('Nota Modificada.');
		// var idTemp = cotizacion._id;
		// delete cotizacion._id;	
		// Cotizacion.update({_id:idTemp},{$set:cotizacion});
		
	
		//this.notasText = false;
		
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
		_.each(rc.cotizacion.detalle,function(detalle){ total += (
		(detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		return total
	};

	this.aumentoIva = function () 
	{
		this.on = !this.on;

		console.log(this.on)		
		
   };

   this.editarCliente = function(id)
	{
    this.cliente = Clientes.findOne({_id:id});
   
	};
	this.getNota= function(nota_id)
	{

	rc.nota = Notas.findOne(nota_id);
		 //this.clientillo = true;
		 this.notasText = true;
	};




};









