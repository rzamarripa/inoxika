Meteor.startup(function () {
  if (Meteor.users.find().count() === 0) {
    var usuario_id = Accounts.createUser({
      username: 'admin',
      password: 'admin123',
      profile : {
	      nombre: 'Administrador',
      }
    });
    
    Roles.addUsersToRoles(usuario_id, 'admin');
  }
});

// Meteor.startup(function () {
//   if (Meteor.users.find().count() === 0) {
//     Accounts.createUser({
//       username: 'admin',
//       password: 'admin123',
//     });
//   }
// });