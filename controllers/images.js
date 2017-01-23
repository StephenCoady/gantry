"use strict";
let Docker = require('dockerode');


let docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listImages = (req, res, next) => {
  docker.listImages((err, images) => {
    res.status(200).json({
      images: images
    })
  });
}

exports.listSpecificImage = (req, res, next) => {
  let id = req.params.id;
  let image = docker.getImage(id);

  image.inspect((err, data) => {
    if (data === null) {
      res.status(404).json({
        message: "No such image",
        error: err
      })
    } else {
      res.status(200).json({
        image: data
      })
    }
  });
}

exports.removeImage = (req, res, next) => {
  let id = req.params.id;
  let image = docker.getImage(id);

  image.remove((err, data) => {
    if (data == null) {
      res.status(409).json({
        message: "Image cannot be removed",
        error: err
      })
    } else {
      res.status(200).json({
        messagemessage: "Image removed successfully"
      })
    }
  });
}

exports.imageHistory = (req, res, next) => {
  let id = req.params.id;
  let image = docker.getImage(id);

  image.history((err, data) => {
    if (data === null) {
      res.status(404).json({
        message: "No such image",
        error: err
      })
    } else {
      res.status(200).json({
        image: data
      })
    }
  });
}
