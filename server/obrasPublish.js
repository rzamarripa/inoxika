Meteor.publish("obras",function(params){
  	return Obras.find(params);
});

Meteor.publish("obra",function(params){
  	return Obras.find(params);
});