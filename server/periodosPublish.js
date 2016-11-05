Meteor.publish("periodos",function(params){
  	return Periodos.find(params);
});


Meteor.publish("periodosCampo",function(params){
  	return Periodos.find(params);
});

Meteor.publish("presupuestosCampo",function(params){
  	return PresupuestosCampo.find(params);
});