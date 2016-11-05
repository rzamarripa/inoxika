Meteor.publish("ordenProduccion",function(params){
  	return OrdenProduccion.find(params);
});
