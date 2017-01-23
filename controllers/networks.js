"use strict";
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listNetworks = (req, res, next) => {
  docker.listNetworks((err, data) => {
    if (data === null) {
      res.status(404).json({
        response: "No networks found",
        error: err
      })
    } else {
      res.status(200).json({
        response: data
      })
    }
  });
}

exports.listSpecificNetwork = (req, res, next) => {
  let id = req.params.id;
  let network = docker.getNetwork(id);

  network.inspect((err, data) => {

    if (data === null) {
      res.status(404).json({
        response: "Network not found",
        error: err
      })
    } else {
      res.status(200).json({
        response: data
      })
    }
  });
}
