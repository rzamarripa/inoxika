Meteor.publish("cotizacion",function(params){
  	return Cotizacion.find(params);
});