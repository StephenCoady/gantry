const express	= require('express');
const controllers = require('./controllers');
const jwt = require('jsonwebtoken');
let config = require('./config');

const user = controllers.user;
const container = controllers.container;
const image = controllers.image;
const network = controllers.network;
const volume = controllers.volume;
const docker = controllers.docker;

const router = express.Router();

/* User Routes*/
router.post('/api/users/authenticate', user.authenticate);
router.post('/api/docker/upload', docker.upload);

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    jwt.verify(token, config.TOKEN_SECRET, function(err, decoded) {      
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

/* User Routes */
router.put('/api/users/', user.changePassword);

/* Container Routes */
router.get('/api/containers/running', container.listRunningContainers);
router.get('/api/containers/all', container.listContainers);
router.get('/api/containers/:id/', container.listSpecificContainer);
router.get('/api/containers/:id/stats', container.listContainerStats);
router.post('/api/containers/:id/start', container.startContainer);
router.post('/api/containers/:id/stop', container.stopContainer);
router.post('/api/containers/:id/pause', container.pauseContainer);
router.post('/api/containers/:id/unpause', container.unpauseContainer);
router.post('/api/containers/:id/restart', container.restartContainer);
router.post('/api/containers/create', container.createContainer);
router.delete('/api/containers/:id/remove', container.removeContainer);

/* Image Routes */
router.get('/api/images', image.listImages);
router.get('/api/images/:id', image.listSpecificImage);
router.delete('/api/images/:id', image.removeImage);
router.get('/api/images/:id/history', image.imageHistory);
router.post('/api/images/pull/', image.pullImage);
router.post('/api/images/:id/tag', image.tagImage);

/* Network Routes */
router.post('/api/networks', network.createNetwork);
router.get('/api/networks', network.listNetworks);
router.get('/api/networks/:id', network.listSpecificNetwork);
router.delete('/api/networks/:id', network.removeNetwork);

/* Volume Routes */
router.post('/api/volumes', volume.createVolume);
router.get('/api/volumes', volume.listVolumes);
router.get('/api/volumes/:id', volume.listSpecificVolume);
router.delete('/api/volumes/:id', volume.removeVolume);


/* Docker System Routes */
router.get('/api/docker/info', docker.getInfo);
router.get('/api/docker/events', docker.getEvents);
router.get('/api/docker/logs/:id', docker.getLogs);
router.post('/api/docker/build', docker.build);
router.post('/api/docker/search', docker.search);

module.exports = router;
