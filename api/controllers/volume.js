"use strict";
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listVolumes = (req, res) => {
  docker.listVolumes((err, data) => {
    res.status(200).json({
      volumes: data
    })
  });
}

exports.listSpecificVolume = (req, res) => {
  let id = req.params.id;
  let volume = docker.getVolume(id);

  volume.inspect((err, data) => {

    if (data === null) {
      res.status(404).json({
        volume: "Volume not found",
        error: err
      })
    } else {
      res.status(200).json({
        volume: data
      })
    }
  });
}

exports.removeVolume = (req, res) => {
  const id = req.params.id;
  const volume = docker.getVolume(id);

  volume.remove((err, data) => {
    if (data === null) {
      res.status(409).json({
        message: 'Volume cannot be removed',
        error: err
      });
    } else {
      res.status(200).json({
        message: 'Volume removed successfully'
      });
    }
  });
};
