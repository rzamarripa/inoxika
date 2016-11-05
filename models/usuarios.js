Usuarios 						= new Mongo.Collection("usuarios");
Usuarios.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});