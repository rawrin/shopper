var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/development.sqlite3',
  },

  useNullAsDefault: false
});

var noOp = function() {};

var db = {
  init: function(callback) {
    callback = callback || noOp;
    knex.schema.createTableIfNotExists('shopper_applicants', function(table) {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('city');
      table.string('phone_number');
      table.boolean('complete');
      table.boolean('background_check');
      table.timestamps();
    })
    // Adding a test user...
    // .then(function() {
    //   knex('shopper_applicants').insert({
    //     first_name: 'Dead',
    //     last_name: 'Pool',
    //     email: 'dead.pool@marvel.com',
    //     phone_number: '3211234567',
    //     complete: false,
    //     created_at: Date.now(),
    //     updated_at: Date.now(),
    //   })
    //   .then(function(user) {
    //     console.log('did user add', user);
    //   })
    //   .catch(function(err) {
    //     // Dump errors into database if applicable..
    //     console.error('err', err);
    //   })
    // })
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
          if (!users.length) {
            user.created_at = Date.now();
            user.updated_at = Date.now();
            return trx
                    .insert(user)
                    .into('shopper_applicants');
          }
          user.updated_at = Date.now();
          return trx
            .select('*')
            .from('shopper_applicants')
            .where({
              email: user.email
            })
            .update(user)
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(function() {
      knex('shopper_applicants')
        .where({
          email: user.email
        })
        .then(function(users) {
          return callback(null, users[0]);
        });
    })
    .catch(function(err) {
      console.log('updateOrInsert error: ', err);
      callback(err);
    });
  },

  query: function(user, callback) {
    callback = callback || noOp;
    knex('applicants')
      .where(user)
      .then(function(users) {
        return callback(null, users);
      })
      .catch(function(err) {
        return callback(err);
      });
  },

  countDatesAndStates: function(opt, callback) {
    callback = callback || noOp;

    knex('applicants')
      .count('*')
      .where(knex.raw('date(created_at) >= ?', opt.start_date))
      .andWhere(knex.raw('date(created_at) <= ?', opt.end_date))
      .andWhere('workflow_state', '=', opt.state)
      .then(function(count) {
        return callback(null, count[0]['count(*)']);
      })
      .catch(function(err) {
        return callback(err);
      });
  }
}

module.exports = db;
