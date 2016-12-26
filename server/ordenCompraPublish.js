Meteor.publish("ordenCompra",function(params){
  	return OrdenCompra.find(params);
});

Meteor.publish("ordenCompraImprimir",function(){
  	return OrdenCompra.find();
});

