OrdenProduccion						= new Mongo.Collection("ordenProduccion");
OrdenProduccion.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});