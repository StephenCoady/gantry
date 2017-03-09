"use strict";
var stringify = require('json-stringify-safe');
const Docker = require('dockerode');
var util = require('util');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.getInfo = (req, res) => {
  docker.info((err, data) => {
    res.status(200).json({
      info: data
    });
  });
}

exports.getEvents = (req, res) => {
  let time = new Date();
  var unixTime = Date.parse(time)/1000
  let hourAgo = new Date();
  hourAgo.setHours(hourAgo.getHours()-24);
  var unixHourAgo = Date.parse(hourAgo)/1000
  
  let opts = {
    since: unixHourAgo, 
    until: unixTime,
    follow: false,
    stdout: true,
    stderr: true
  }
  docker.getEvents(opts, (err, data) => {
    if(err){
      return res.status(500).json({
        error: err
      })
    } else {
      const StringDecoder = require('string_decoder').StringDecoder;
      const decoder = new StringDecoder('utf8');
      let responseBody = '';
      data.on('data', function(chunk) {
        responseBody += decoder.write(chunk);
      });
      data.on('end', function() {
        let response = responseBody.replace(/\\/g, '');
        res.status(200).json({
          events: response
        })
      });
    }
  });
}

exports.getLogs = (req, res, next) => {
  let id = req.params.id;
  let container = docker.getContainer(id);

  let opts = {
    follow: false,
    stdout: true,
    stderr: true
  }

  container.logs(opts, (err, data) => {
    if (data === null) {
      res.status(404).json({
        response: "Container not found",
        error: err
      })
    } else {
      const StringDecoder = require('string_decoder').StringDecoder;
      const decoder = new StringDecoder('utf8');
      
      data.on('data', function(chunk) {
        res.status(200).json({
          response: decoder.write(chunk)
        })
      });
    }
  });
}
