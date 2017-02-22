"use strict";
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listContainers = (req, res) => {
  docker.listContainers({
    'all': 1
  }, (err, data) => {
      res.status(200).json({
        containers: data
      });
  });
}

exports.listRunningContainers = (req, res) => {
  docker.listContainers((err, data) => {
      res.status(200).json({
        containers: data
      })
  });
}

exports.listSpecificContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.inspect((err, data) => {
    if (data == null) {
      res.status(404).json({
        message: "Container not found",
        error: err
      })
    } else {
      res.status(200).json({
        container: data
      })
    }
  });
}

exports.startContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.start((err, data) => {

    if (data == null) {
      res.status(409).json({
        message: "Container cannot be started",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container started successfully"
      })
    }
  });
}

exports.stopContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.stop((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Container cannot be stopped",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container stopped successfully"
      })
    }
  });
}

exports.restartContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.restart((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Container cannot be restarted",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container restarted successfully"
      })
    }
  });
}

exports.removeContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.remove((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Container cannot be removed",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container removed successfully"
      })
    }
  });
}

exports.pauseContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.pause((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Container cannot be paused",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container paused successfully"
      })
    }
  });
}

exports.unpauseContainer = (req, res) => {
  const id = req.params.id;
  const container = docker.getContainer(id);

  container.unpause((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Container cannot be unpaused",
        error: err
      })
    } else {
      res.status(200).json({
        message: "Container unpaused successfully"
      })
    }
  });
}

exports.createContainer = (req, res) => {
  docker.createContainer(req.body, (err, data) => {
    if (data == null) {
      res.status(500).json({
        message: "Container cannot be created",
        error: err
      })
    } else {
      res.status(201).json({
        message: "Container created successfully"
      })
    }
  });
}
