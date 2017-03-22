let Datastore = require('nedb');
let path = require('path');
let fs = require('fs');
let dbPath = path.join(__dirname, '/db');
let userPath = path.join(__dirname, '../../../db/users.db');

let users = {};

function dbCheck(path) {
  if (!fs.existsSync(path)) {
    users = new Datastore({
      filename: path,
      autoload: true
    });

    var admin = {
      name: 'admin',
      password: 'admin'
    };

    users.insert(admin, function(err, doc) {
      if(!err){
        console.log('Database created');
      }
    });
  } else {
    console.log('Database detected');
    users = new Datastore({
      filename: userPath,
      autoload: true
    });
  }
}

dbCheck(userPath);


module.exports = users;
