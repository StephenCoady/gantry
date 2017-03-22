let Datastore = require('nedb');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
let config = require('../config');

let users = require('../models/user');

exports.authenticate = (req, res) => {
  let name = req.body.name;
  let password = req.body.password;

  users.findOne({
    name: name
  }, function(err, doc) {
    if (doc) {
      if (name == doc.name && password == doc.password) {
        let token = jwt.sign(doc, config.TOKEN_SECRET, {
          expiresIn: '48h'
        });
        res.status(200).json({
          token: token
        })
      } else {
        res.status(400).json({
          response: 'Username/password incorrect'
        })
      }
    } else {
      res.status(400).json({
        response: 'Username/password incorrect'
      })
    }
  });
}
