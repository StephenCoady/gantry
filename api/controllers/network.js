"use strict";
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.createNetwork = (req, res) => {
  docker.createNetwork(req.body, (err, data) => {
    if(data){
      res.status(201).json({
        network: data
      })
    } else {
      res.status(500).json({
        error: err
      })
    }
  });
}

exports.listNetworks = (req, res) => {
  docker.listNetworks((err, data) => {
    res.status(200).json({
      networks: data
    })
  });
}

exports.listSpecificNetwork = (req, res) => {
  const id = req.params.id;
  const network = docker.getNetwork(id);

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

exports.removeNetwork = (req, res) => {
  const id = req.params.id;
  const network = docker.getNetwork(id);

  network.remove((err, data) => {
    if (data === null) {
      res.status(409).json({
        message: 'Network cannot be removed',
        error: err
      });
    } else {
      res.status(200).json({
        message: 'Network removed successfully'
      });
    }
  });
};
