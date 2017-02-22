'use strict';
const Docker = require('dockerode');

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

exports.listImages = (req, res) => {
  docker.listImages((err, data) => {
    res.status(200).json({
      images: data
    });
  });
};

exports.listSpecificImage = (req, res) => {
  const id = req.params.id;
  const image = docker.getImage(id);

  image.inspect((err, data) => {
    if (data === null) {
      res.status(404).json({
        message: 'No such image',
        error: err
      });
    } else {
      res.status(200).json({
        image: data
      });
    }
  });
};

exports.removeImage = (req, res) => {
  const id = req.params.id;
  const image = docker.getImage(id);

  image.remove((err, data) => {
    if (data === null) {
      res.status(409).json({
        message: 'Image cannot be removed',
        error: err
      });
    } else {
      res.status(200).json({
        messagemessage: 'Image removed successfully'
      });
    }
  });
};

exports.imageHistory = (req, res) => {
  const id = req.params.id;
  const image = docker.getImage(id);

  image.history((err, data) => {
    if (data === null) {
      res.status(404).json({
        message: 'No such image',
        error: err
      });
    } else {
      res.status(200).json({
        image: data
      });
    }
  });
};

exports.pullImage = (req, res) => {
  const name = req.body.name;
  let tag = '';

  if (req.body.tag === '') {
    tag = 'latest';
  } else {
    tag = req.body.tag;
  }

  const repoTag = name + ':' + tag;
  docker.pull(repoTag, (err, stream) => {
    docker.modem.followProgress(stream, onFinished);

    function onFinished(err, output) {
      if (output === null) {
        res.status(404).json({
          message: 'Cannot find the image requested',
          error: err
        });
      } else {
        res.status(200).json({
          response: 'Image successfully pulled'
        });
      }
    }
  });
};

exports.tagImage = (req, res) => {
  const id = req.params.id;
  const image = docker.getImage(id);
  const tag = req.body;
  console.log(req.body);

  image.tag(tag, (err, data) => {
    if (data === null) {
      res.status(404).json({
        message: 'No such image',
        error: err
      });
    } else {
      res.status(200).json({
        image: data
      });
    }
  });
};
