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
