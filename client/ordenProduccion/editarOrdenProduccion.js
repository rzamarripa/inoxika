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
	return [{estatus:1}] 
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
		  return Cotizacion.findOne();
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

	    	
	    	orden = OrdenProduccion.findOne({_id : $stateParams.ordenProduccion_id});
	     
	    	_.each(orden.detalle, function(partida){
	    		if (partida.estatus == undefined) {
	    		partida.estatus = 1;
	  }

	    	});
	    


	    	console.log(orden);
		  return orden
	  },
	   ordenEditar : () => {
		  return OrdenProduccion.findOne();
	  },

  });






 this.quitarhk=function(obj){
	if(Array.isArray(obj)){
		for (var i = 0; i < obj.length; i++) {
			obj[i] =this.quitarhk(obj[i]);
		}
	}
	else if(obj !== null && typeof obj === 'object'){
		delete obj.$$hashKey;
		for (var name in obj) {
				obj[name] = this.quitarhk(obj[name]);
		}	
	}
	return obj;
}



  

	this.nuevo = true;
	this.guardar = true; 
	this.tabla 	= false; 
	this.agregar = true;
	  this.action = true;
	  this.seccion = false;


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

		console.log(this.cotizacionManual)
		cotizacionManual.tipo = "manual";
		this.ordenes.detalle.push(cotizacionManual);
		this.ordenes.estatus = 1;
		this.guardar = false; 
		this.productoTipo = false;
		this.on = false;
		this.tabla 	= true;
		this.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		this.cotizacionManual = {};
		this.seccion = false;

	};
	this.agregarProducto = function(cotizacionProducto)
	{ 
	
		cotizacionProducto.tipo = "producto";
		this.ordenes.detalle.push(cotizacionProducto);
		this.ordenes.estatus = 1;
		console.log(this.cotizacionProducto);
		this.guardar = false; 
		this.productoTipo = false;
		_.each(cotizacionProducto.detalle, function(detalle){
			rc.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		});
		this.productoSeleccionado = {};
		this.seccion = false;
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
    this.seccion = true;

	};

		this.actualizarProducto= function(cotizacion)
	{


		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});	
		rc.cotizacion.detalle[this.productoIndice] = cotizacion;
	    var idTemp = cotizacion._id;
		delete cotizacion._id;	
		OrdenProduccion.update({_id:idTemp},{$set:cotizacion});
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	    this.agregar = true;
	    this.seccion = false;
	
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

		console.log(this.cotizacion);
		_.each(rc.ordenes.detalle, function(orden){
			delete orden.$$hashKey;
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

    this.getProductos= function(producto)
	{
		console.log(producto);
		rc.productoSeleccionado = producto;
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



var pendiente = false;
this.cambiarEstatusPartida = function(partidaSeleccionada, estatus, index, id,){
	partidaSeleccionada.estatus = estatus;
	console.log(rc.ordenes);
	delete partidaSeleccionada.$$hashKey;
	OrdenProduccion.update({_id: id}, {$set : { detalle : rc.ordenEditar.detalle}})
	var todasTerminadas = true;

	_.each(rc.ordenEditar.detalle, function(partida){
		if(partida.estatus == 1){
			todasTerminadas = false;
			
		}
	});
		_.each(rc.ordenEditar.detalle, function(partida){
		if(partida.estatus == 1){
			todasTerminadas = true;
			
		}
	});
	console.log(todasTerminadas)
//_.each(rc.ordenEditar, function(partida){
	if(todasTerminadas == true){
		console.log("entro")

		var orden = OrdenProduccion.findOne({_id:id});
		if(orden.estatus == 1)
			orden.estatus = 2;
		else
			orden.estatus = 1;
		console.log(orden)
		
		OrdenProduccion.update({_id: id},{$set :  {estatus : orden.estatus}});
	}
//});
console.log(todasTerminadas)

}


	this.eliminarProducto = function($index)
	{
		rc.ordenes.detalle.splice($index, 1);
    };




};









