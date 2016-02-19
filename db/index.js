var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/test.sqlite3',
  },
  useNullAsDefault: false
});

var noOp = function() {};

var db = {
  init: function(callback) {
    callback = callback || noOp;
    console.log('Creating tables...');
    knex.schema.createTableIfNotExists('shopper_applicants', function(table) {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('city');
      table.string('phone_number');
      table.boolean('completed');
      table.boolean('background_check');
      table.timestamps();
    })
    .then(function() {
      console.log('Adding initial test user...');
      knex('shopper_applicants').insert({
        first_name: 'Dead',
        last_name: 'Pool',
        email: 'dead.pool@marvel.com',
        phone_number: '3211234567',
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
      })
      .then(function(user) {
        console.log('did user add', user);
      })
      .catch(function(err) {
        // Dump errors into database if applicable..
        console.error('err', err);
      })
    })
    .catch(function(err) {
      console.log('err', err);
      callback();
    });
  },
  updateOrInsert: function(user, callback) {
    callback = callback || noOp;
    knex.transaction(function(trx) {
      knex('shopper_applicants')
        .where({
          email: user.email
        })
        .transacting(trx)
        .then(function(users) {
          console.log('users: ', users);
          if (!users.length) {
            console.log('inserting..');
            return trx
                    .insert(user)
                    .into('shopper_applicants');
          }
          return trx
            .select('*')
            .from('shopper_applicants')
            .where({
              email: user.email
            })
            .update(user);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function() {
      console.log('updateOrInsert complete...');
      callback(null, user);
    })
    .catch(function(err) {
      console.log('updateOrInsert error: ', err);
      callback(err);
    });
  },

  query: function(user, callback) {
    callback = callback || noOp;
    knex('shopper_applicants')
      .where(user)
      .then(function(users) {
        return callback(null, users);
      })
      .catch(function(err) {
        return callback(err);
      });
  }
}

module.exports = db;
