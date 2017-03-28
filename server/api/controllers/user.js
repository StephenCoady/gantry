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

exports.changePassword = (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  let desired_password = req.body.desired_password;
  if (req.body.desired_password != undefined) {
    users.findOne({
      name: name
    }, function(err, doc) {
      if (doc) {
        if (name == doc.name && password == doc.password) {
          users.update({
            name: name
          }, {
            $set: {
              password: desired_password
            }
          }, function(error, document) {
            if (document) {
              res.status(200).json({
                response: 'User updated'
              })
            }
          })
        } else {
          res.status(400).json({
            response: 'Username/password incorrect'
          })
        }
      } else {
        res.status(404).json({
          response: 'User not found'
        })
      }
    })
  } else {
    res.status(500).json({
      response: 'No new password received'
    })
  }
}
