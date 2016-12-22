angular.module("inoxica")
.controller("NotasCtrl", NotasCtrl);  
function NotasCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
let rc = $reactive(this).attach($scope);

	this.subscribe('notas',()=>{
	return [{estatus:true}] 
    });


 
	
  this.action = true;
  
	this.helpers({
	  notas : () => {
		  return Notas.find();
	  },
	  materiales : () => {
		  return Materiales.find();
	  },
	
  });
  
	this.nuevo = true;  	  
  this.nuevoNota = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.nota = {};
	
  };
  
	this.guardar = function(nota)
	{ 
		//producto.material_id = this.material_id;	
		this.nota.estatus = true;
		console.log(this.nota);
		Notas.insert(this.nota);
		toastr.success('nota guardada.');
	     this.nota = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
	};
	
	this.editar = function(id)
	{
    this.nota = Notas.findOne({_id:id});
    this.action = false;
    $('.collapse').collapse('show');
    this.nuevo = false;
	};
	
	this.actualizar = function(nota)
	{
		var idTemp = nota._id;
		delete nota._id;
		// _.each(rc.nota.detalle, function(nota){
		// 	delete nota.$$hashKey;
		// });			
		Notas.update({_id:idTemp},{$set:nota});
		$('.collapse').collapse('hide');
		this.nuevo = true;
		console.log(nota);
	};

	this.cambiarEstatus = function(id)
	{
		var nota = Notas.findOne({_id:id});
		if(nota.estatus == true)
			nota.estatus = false;
		else
			nota.estatus = true;
		
		Notas.update({_id: id},{$set :  {estatus : nota.estatus}});
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
		
};
