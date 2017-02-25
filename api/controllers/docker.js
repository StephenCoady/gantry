"use strict";
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
