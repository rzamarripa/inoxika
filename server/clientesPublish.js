Meteor.publish("clientes",function(){
  	return Clientes.find();
});

Meteor.publish("cliente",function(options){
  	return Clientes.find(options.id,{}, {sort: {createdAt: -1}, limit: 5});
  	// Clientes.find(options.id);
});