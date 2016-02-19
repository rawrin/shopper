var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/development.sqlite3',
  },
  useNullAsDefault: true
});

var db = {
  init: function(callback) {
    knex.schema.createTableIfNotExists('shopper_applicants', function(table) {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('phone_number');
      table.boolean('completed');
      table.timestamps();
    });
    callback();
  }
}

module.exports = db;