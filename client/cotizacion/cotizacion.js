angular.module("inoxica")
.controller("CotizacionCtrl", CotizacionCtrl);  
function CotizacionCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);

	this.cotizacion = {};


    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });
     this.subscribe('buscarCotizaciones',()=>{
	return [{estatus:1}] 
    });
 //      this.subscribe('ultimaCotizacion',()=>{
	// return [{}] 
 //    });
      this.subscribe('clientes',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('productos',()=>{
	return [{estatus:true}] 
    });
    this.subscribe('unidades',()=>{
	return [{estatus:true}] 
    });
 //      this.cotizacion = {};
 //      this.cotizacionProducto = {};
 //      this.cotizacion.detalle = [];
 //      this.cotizacion.detalleDelProducto = [];
 //      this.subTotal = 0.00;
 //      this.cotizacionManual = {};

 // this.clienteSeleccionado = {};
 // this.productoSeleccionado = {};	
  this.action = true;
	this.helpers({
	  cotizaciones : () => {
		  return Cotizacion.find();
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
		  return Productos.find();
	  },
	   unidades : () => {
		  return Unidades.find();
	  },
	   cantidad : () => {
			 var x = Counts.get('number-cotizaciones');
			 console.log(x);
			 return x;
	  },
	  	  matricula : () => {
			  var cotizacionAnterior = 0;
			  if(this.getReactively("cantidad") > 0){
			  	rc.cotizacion.folio = this.cantidad + 1;
			  	console.log(rc.cotizacion.folio)
			  }
			  else{
				  rc.cotizacion.folio = 1;
				  console.log(rc.cotizacion.folio)
				 
			  }
	    },	
  });

  
	this.nuevo = true;
	this.guardar = true;  

	var doc = new PDFDocument({size: 'A4', margin: 50});	  
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
		this.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		this.cotizacionManual = {};
		
	};
	this.agregarProducto = function(cotizacionProducto)
	{ 
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
	};

	 this.guardarCotizacion = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
			
		 var total = 0;
		_.each(rc.cotizacion.detalle,function(detalle){ total +=
		 ((detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		_.each(rc.producto.detalleProducto,function(producto){total += producto.precio * producto.cantidad});

		this.cotizacion.subTotal = total
		this.cotizacion.estado = true;
		this.cotizacion.nombrePrimerProducto = this.cotizacion.detalle[0].nombre 
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

	this.SumaPrecioProductos = function(){
		total = 0;
		_.each(rc.cotizacion.detalle,function(detalle){ total += (
		(detalle.precio * detalle.utilidad /100 + detalle.precio)  * detalle.cantidad)});
		return total
	}

	this.imprimir = function(printableArea){
     var printContents = document.getElementById(printableArea).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

	



		
};