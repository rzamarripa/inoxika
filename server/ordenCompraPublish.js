Meteor.publish("ordenCompra",function(params){
  	return OrdenCompra.find(params);
});
