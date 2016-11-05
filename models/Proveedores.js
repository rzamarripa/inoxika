Proveedores 						= new Mongo.Collection("proveedores");
Proveedores.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});