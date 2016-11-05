Meteor.publish("cotizacion",function(params){
  	return Cotizacion.find(params);
});
Meteor.publish("ultimaCotizacion",function(){
  	return Cotizacion.find({},{},{$sort: {numeroCotizacion:-1},limit:1});
});

Meteor.publish("buscarCotizaciones",function(options){
		
		Counts.publish(this, 'number-cotizaciones',Cotizacion.find(options));
		return 	Cotizacion.find(options)
});


Meteor.publish("buscarAlumnos",function(options){
		let selector = {
	  	"profile.nombreCompleto": { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
	  	"profile.seccion_id": options.where.seccion_id,
	  	"_id":options.where._id,
	  	roles : ["alumno"]
		}
		console.log(selector);
		Counts.publish(this, 'number-alumnos',Meteor.users.find({roles : ["alumno"],'profile.campus_id':options.where.campus_id,"profile.seccion_id": options.where.seccion_id}),{noReady: true});	
		return Meteor.users.find(selector, options.options);	
	
});