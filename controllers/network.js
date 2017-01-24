"use strict";
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listNetworks = (req, res) => {
  docker.listNetworks((err, data) => {
    res.status(200).json({
      networks: data
    })
  });
}

exports.listSpecificNetwork = (req, res) => {
  let id = req.params.id;
  let network = docker.getNetwork(id);

  network.inspect((err, data) => {

    if (data === null) {
      res.status(404).json({
        network: "Network not found",
        error: err
      })
    } else {
      res.status(200).json({
        network: data
      })
    }
  });
}
