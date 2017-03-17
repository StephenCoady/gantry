"use strict";
let stringify = require('json-stringify-safe');
const Docker = require('dockerode');
let util = require('util');
let path = require('path');
const fs = require('fs');


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
  const time = new Date();
  var unixTime = Date.parse(time.toString()) / 1000
  const hourAgo = new Date();
  hourAgo.setHours(hourAgo.getHours() - 24);
  var unixHourAgo = Date.parse(hourAgo.toString()) / 1000

  const opts = {
    since: unixHourAgo,
    until: unixTime,
    follow: false,
    stdout: true,
    stderr: true
  }
  docker.getEvents(opts, (err, data) => {
    if (err) {
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
        const response = responseBody.replace(/\\/g, '');
        res.status(200).json({
          events: response
        })
      });
    }
  });
}

exports.getLogs = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  const opts = {
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
      let responseBody = '';
      data.on('data', function(chunk) {
        responseBody += decoder.write(chunk);
      });
      data.on('end', function() {
        const response = responseBody.replace(/\\/g, '');
        res.status(200).json({
          response: response
        })
      });
    }
  });
}

exports.upload = (req, res) => {
  fs.readFile(req.files[0].path, function (err, data) {
    var path = require('path');
    var savePath = path.dirname(require.main.filename);
    savePath += '/uploads/Dockerfile';
    
    fs.writeFile(savePath, data, function (err) {
      res.status(201).json({
        response: 'File saved'
      });
    });
  });
}

exports.build = (req, res) => {
  console.log(req.body);
  const name = req.body.name.toLowerCase();
  let appDir = path.dirname(require.main.filename);
  appDir += '/uploads';
  
  docker.buildImage({
    context: appDir,
    src: ['Dockerfile']
  }, {t: name}, function(error, data) {
    if (error) {
      res.status(500).json({
        error: error
      });
    } else {
      const StringDecoder = require('string_decoder').StringDecoder;
      const decoder = new StringDecoder('utf8');
      let responseBody = '';
      data.on('data', function(chunk) {
        responseBody += decoder.write(chunk);
      });
      data.on('end', function() {
        res.status(200).json({
          response: responseBody
        })
      });
    }
  });
}
