Cotizacion 						= new Mongo.Collection("cotizacion");
Cotizacion.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});