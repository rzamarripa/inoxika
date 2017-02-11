angular.module("inoxica")
.controller("OrdenCompraCtrl", OrdenCompraCtrl);  
function OrdenCompraCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);

	this.materialIndice = 0;

	this.subscribe('productos',()=>{
	return [{estatus:true}] 
    });

    this.subscribe('materiales',()=>{
	return [{estatus:true}] 
    });

    this.subscribe('unidades',()=>{
	return [{estatus:true}] 
    });

    this.subscribe('ordenCompra',()=>{
	return [{estado:"pendiente"}] 
    });
     this.subscribe('proveedores',()=>{
	return [{estatus:true}] 
    });
      this.subscribe('cotizacion',()=>{
	return [{estatus:1}] 
    });

 
 
	
  this.action = true;
  this.agregar = true;
  this.cancelar = false;
  
	this.helpers({
	  ordenCompra : () => {
		 var ordenes = OrdenCompra.find().fetch();
		 ordenes.estado = "pendiente"
		  	if (ordenes) {
		  		_.each(ordenes, function(orden){
		  			orden.proveedor = Proveedores.findOne(orden.proveedor_id)
		  			

		  	});
	  	}
	  	console.log(ordenes);
		  return ordenes;
	  },
	    proveedores : () => {
		  return Proveedores.find();
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
	  materiales : () => {
		  return Materiales.find();
	  },
	  unidades : () => {
		  return Unidades.find();
	  },
	  cotizacion : () => {
		  return Cotizacion.findOne({_id : $stateParams.ordenCompra_id});
	  },
  });
  
	this.nuevo = true;

 this.materialSeleccionado = {};
 this.material = {};
 this.producto = {};
 this.producto.detalleProducto = [];

  this.nuevoProductos = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.producto = {};
    this.producto.detalleProducto = [];
    this.material = {};	
    this.materialSeleccionado = {};	
  };

 
  
  this.agregarMaterial = function(material)
	{ 
		//producto.material_id = this.material_id;
		
		this.producto.detalleProducto.push(material);
		console.log(rc.producto)
		this.materialSeleccionado = {};
		this.material = {};
		
	};
	
	this.modificarMaterial = function(material)
	{
		rc.producto.detalleProducto[this.materialIndice] = material;
		this.agregar = true;
		this.cancelar = false;
		this.materialSeleccionado = {};
		this.material = {};
	}
	
	this.editar = function(id)
	{
    this.producto = Productos.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};

   
	this.editarMaterial = function($index)
	{
    this.materialSeleccionado = rc.producto.detalleProducto[$index];
    //this.materialSeleccionado._id = _id;

    this.agregar = false;
    this.cancelar = true;
    this.materialIndice = $index;
    console.log(this.materialSeleccionado);

	};
	
	this.actualizar = function(producto)
	{
		var idTemp = producto._id;
		delete producto._id;
		_.each(rc.producto.detalleProducto, function(producto){
			delete producto.$$hashKey;
		});	
		Productos.update({_id:idTemp},{$set:producto});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(producto);
	};

	this.cambiarEstatus = function(id)
	{
		var producto = Productos.findOne({_id:id});
		if(producto.estatus == true)
			producto.estatus = false;
		else
			producto.estatus = true;
		
		Productos.update({_id: id},{$set :  {estatus : producto.estatus}});
    };
    this.cambiarEstatusMaterial = function(id)
	{
		var producto = rc.producto.detalleProducto
		if(producto.estatus == true)
			producto.estatus = false;
		else
			producto.estatus = true;
		
		Productos.update({_id: id},{$set :  {estatus : producto.estatus}});
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
	 this.getUnidad= function(unidad_id)
	{
		var unidad = Unidades.findOne(unidad_id);
		if(unidad)
		return unidad.nombre;
	};

	    this.getProveedor= function(proveedor_id)
	{
		var proveedor = Proveedores.findOne(proveedor_id);
		if(proveedor)
		return proveedor.nombre;
	};

	this.cancelarMaterial = function()
	{
		this.agregar = true
		this.cancelar = false;
		this.materialSeleccionado = {};
	}


	this.SumaPrecioProductos = function(){
		total = 0;
		_.each(rc.producto.detalleProducto,function(producto){total += producto.precio * producto.cantidad});
		return total
	}
		this.cambioAceptar = function(id)
	{
  console.log("el helper",rc.ordenCompra)
	    var orden = rc.ordenCompra;

		if(orden.estado == "pendiente")
			orden.estado = "aceptada";
		else
			orden.estado = "pendiente";
		
		OrdenCompra.update({_id: id},{$set :  {estado : orden.estado}});

		console.log(orden)
		toastr.success('Aceptada.');

		
	}
	this.cambioRechazada = function(id)
	{


			var orden = rc.ordenCompra;
		if(orden.estado == "pendiente")
			orden.estado = "rechazada";
		else
			orden.estado = "pendiente";
		
		OrdenCompra.update({_id: id},{$set :  {estado : orden.estado}});

		
	}

		
};
