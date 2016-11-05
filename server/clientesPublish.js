Meteor.publish("clientes",function(){
  	return Clientes.find();
});

Meteor.publish("cliente",function(options){
  	return Clientes.find(options.id);
});