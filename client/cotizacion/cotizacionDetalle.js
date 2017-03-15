angular.module("inoxica")
.controller("CotizacionDetalleCtrl", CotizacionDetalleCtrl);  
function CotizacionDetalleCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);


    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });
     this.subscribe('cotizacion',()=>{
	return [{}] 
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
    this.productoSeleccionado = {};

      
  
	this.helpers({
	  cotizacion : () => {
		  return  Cotizacion.findOne({_id : $stateParams.cotizacion_id});
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
	    	notas = Notas.find();
	    	// _.each(notas, function(nota){
	    	// 	delete nota.$$hashKey;

	    	// });
		  return  notas;
	  },
	       ultimaCotizacion : () => {
	    
	 

	 
			
			 return Cotizacion.find({}, {sort: {fechaInicio: -1}, limit: 1});
	  },
  });

	console.log("lo que contiene el folio",rc.ultimaCotizacion)
  

  this.nuevo = true;
  this.guardar = true; 
  this.tabla 	= false; 
  this.action = true;
  this.botonIva = false;
  this.notasText = false;
  this.comboNota = true;

      this.cliente = {};
      this.cotizacion = {};
	  this.cotizacion.fechaInicio = new Date();
	  var diaDeHoy = moment();
	  var diezDias = moment(diaDeHoy,"DD-MM-YYYY").add('days',10);
	  var day = diezDias.format('DD');
	  var month = diezDias.format('MM');
  	  var year = diezDias.format('YYYY');
      this.cotizacion.fechaVencimiento = day + '-' + month + '-' + year;
      this.cotizacionProducto = {};
      this.cotizacion.detalle = [];
      this.subTotal = 0.00;
      this.cotizacionManual = {};
      this.productoIndice = 0;
	  this.clienteSeleccionado = {};
	  this.productoSeleccionado = {};
	  this.cotizacionManual.utilidad = this.clienteSeleccionado.utilidad
	  this.productoSeleccionado.utilidad = this.clienteSeleccionado.utilidad
	  this.nota = {};


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
		this.botonIva = true;
		//cotizacion.material_id = this.material_id;
		console.log(this.cotizacion)
		cotizacionManual.tipo = "manual";
		cotizacionManual.utilidad = this.clienteSeleccionado.utilidad
		cotizacionManual.estatus = 1
		this.cotizacion.detalle.push(cotizacionManual);
		console.log(this.cotizacion);
		this.guardar = false; 
		this.productoTipo = false;
		this.on = false;
		this.tabla 	= true;
		this.subTotal += (cotizacionManual.precio + (cotizacionManual.precio * cotizacionManual.utilidad /100)  * cotizacionManual.cantidad)
		* cotizacionManual.cantidad ;
		this.cotizacionManual = {};
		
	};
	this.agregarProducto = function(cotizacionProducto)
	{ 
		this.botonIva = true;
		cotizacionProducto.tipo = "producto";
		cotizacionProducto.utilidad = this.clienteSeleccionado.utilidad
		this.cotizacion.detalle.push(cotizacionProducto);
		this.cotizacion.detalle.estatus = 1;
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
		_.each(rc.cotizacion.detalleProducto,function(producto){total += producto.precio * producto.cantidad});
		this.cotizacion.subTotal = total;
		this.cotizacion.total = total - total*0.16;
		this.cotizacion.nombrePrimerProducto = this.cotizacion.detalle[0].nombre 
		this.cotizacion.estatus = 1;
		this.cotizacion.ordenProduccion = true;

      folio = 0;
      	_.each(rc.ultimaCotizacion, function(cotizacion){
      		folio = cotizacion.folio
      		rc.folio = folio
      	});
     
      	console.log("nuebva cosa",rc.folio)




      console.log("folio del hlper",rc.ultimaCotizacion)
		  if(rc.folio > 0){
		  	console.log("entro")
		  
			  	cotizacion.folio = rc.folio + 1
			  	
			  }else{
			  		console.log("else")
			  	cotizacion.folio = 1
			  }


		Cotizacion.insert(this.cotizacion);
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
		$state.go('root.cotizacionPendiente')
	};
	
	this.editar = function(id)
	{
    this.cotizacion = Cotizacion.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};



	this.editarCliente = function(id)
	{
    this.cliente = Clientes.findOne({_id:id});
   
	};


	this.editarProducto = function($index)
	{
    this.productoSeleccionado = rc.cotizacion.detalle[$index];

    this.agregar = false;
    this.cancelar = true;
    this.action = false;
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
		this.action = true;
		this.productoSeleccionado = {};
	    this.cotizacionManual = {};
	
	};
	this.eliminarProducto = function($index)
	{
		//this.materialIndice = $index;
		rc.cotizacion.detalle.splice($index, 1);
    };

	
	this.actualizar = function(cotizacion)
	{
		console.log(this.cotizacion);
		_.each(rc.cotizacion.detalle, function(cotizacion){
			delete cotizacion.$$hashKey;
			});
		var idTemp = cotizacion._id;
		delete cotizacion._id;		
		Cotizacion.update({_id:idTemp},{$set:cotizacion});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(cotizacion);
		$state.go('root.cotizacion')
	};
	this.actualizarNota = function(nota)
	{
		console.log("nota lo que tiene",nota);
		var idTemp = nota._id;
		delete nota._id;	
		console.log("el id de la nota",idTemp)	
		
		// Notas.update({_id:idTemp},
		// { $set : { nombre : idTemp}});
		this.notasText = false

		Notas.update({_id:idTemp},{$set:nota});
		console.log("act da nota",nota);
		toastr.success('Nota Modificada.');
		
	
		//this.notasText = false;
		
	};

	this.quitarComboNota = function()
	{
		//this.materialIndice = $index;
		this.comboNota = false;
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

 //    this.getProductos= function(producto)
	// {
	// 	console.log(producto);
	// 	rc.productoSeleccionado = producto;
	// 	console.log(rc.productoSeleccionado)
	// };

	//this.getMateriales= function(material_id)
	// {
	// 	console.log(material_id);
	// 	rc.materialSeleccionado = Materiales.findOne(material_id);
	// 	rc.materialSeleccionado.unidad = Unidades.findOne(rc.materialSeleccionado.unidad_id);
	// };

		this.getProductos= function(producto_id)
		{
		
	     	_.each(rc.productos, function(producto){
	     		delete producto.$$hashKey;

	     	});

			console.log(producto_id);
			rc.productoSeleccionado = Productos.findOne(producto_id);
			rc.productoSeleccionado.unidad = Unidades.findOne(rc.productoSeleccionado.unidad_id);
		};

	 this.obternerProducto= function(producto_id)
	{
		var producto = Productos.findOne(producto_id);
		if(producto)
		return producto.nombre;
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
	 this.getUtilidad= function(unidad_id)
	{
		var unidad = Unidades.findOne(unidad_id);
		if(unidad)
		return unidad.nombre;
	};
	// this.getNota= function(nota_id)
	// {


	// rc.nota = Notas.findOne(nota_id);
	// 	 //this.clientillo = true;
	// 	 this.notasText = true;

	// 	 	notas = Notas.find();
	//     	_.each(rc.notas, function(nota){
	//     		delete nota.$$hashKey;

	//     	});
	// };

	this.getNota= function(nota_id)
	{
		this.notasText = true;
		console.log(nota_id);
		rc.nota = Notas.findOne(nota_id);
		//rc.nota.unidad = Unidades.findOne(rc.nota.unidad_id);
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




};









