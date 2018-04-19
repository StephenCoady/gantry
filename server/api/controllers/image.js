'use strict';
const Docker = require('dockerode');
const exec = require('shelljs').exec;
const writeFile = require('write');
const async = require('async');

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
        message: 'Image removed successfully'
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
  let tag = req.body.tag;

  if (tag === '') {
    tag = 'latest';
  }

  const repoTag = `${name}:${tag}`;
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

exports.pushImage = (req, res) => {
  req.connection.setTimeout( 1000 * 60 * 30 );

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Invalid username or password'
    });
  }

  const passwordPathHost = '/tmp/dockerpassword';
  const passwordPathContainer = '/dockerpassword';
  const id = req.params.id;
  const image = docker.getImage(id);

  let imageTag;

  async.series([
    function(callback) {
      image.inspect((err, data) => {
        if (data === null) {
          return callback({
            message: 'No such image',
            error: err,
            code: 404
          });
        }

        if (data.RepoTags.length === 0) {
          return callback({
            message: 'Please give the image a tag'
          });
        }

        const repoTagsParts = data.RepoTags[0].split('/');
        const stripLatest = tag => tag.split(':')[0];
        imageTag = `${username}/${repoTagsParts.length === 1 ? stripLatest(repoTagsParts[0]) : stripLatest(repoTagsParts[1])}`;
        callback(null);
      });
    },
    function(callback) {
      writeFile(passwordPathHost, password, err => {
        if (err) {
          const errMsg = 'Failed to authenticate with Docker';
          err.message = err.message ? (err.message += `\n${errMsg}`) : errMsg;
          return callback(err);
        }
        callback(null);
      });
    },
    function(callback) {
      exec(`docker tag ${id} ${imageTag} && docker run --rm -v ${passwordPathHost}:${passwordPathContainer} -v /var/run/docker.sock:/var/run/docker.sock --entrypoint /bin/ash docker -c "cat ${passwordPathContainer} | docker login --username ${username} --password-stdin && docker push ${imageTag}"`,
        {silent:true},
        code => {
          if (code !== 0) {
            return callback({
              message: 'Failed to push image to Docker'
            });
          }

          callback(null);
        });
    }
  ],
  function(err) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

    res.status(200).json({
      message: 'Pushed image to Docker'
    });
  });
};

exports.tagImage = (req, res) => {
  const id = req.params.id;
  const image = docker.getImage(id);
  const tag = req.body;

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
