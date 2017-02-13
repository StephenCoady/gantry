const express	= require('express');
const controllers = require('./controllers');

const container = controllers.container;
const image = controllers.image;
const network = controllers.network;

const router = express.Router();

/* Container Routes */
router.get('/api/containers/running', container.listRunningContainers);
router.get('/api/containers/all', container.listContainers);
router.get('/api/containers/:id/', container.listSpecificContainer);
router.post('/api/containers/:id/start', container.startContainer);
router.post('/api/containers/:id/stop', container.stopContainer);
router.post('/api/containers/:id/pause', container.pauseContainer);
router.post('/api/containers/:id/unpause', container.unpauseContainer);
router.post('/api/containers/:id/restart', container.restartContainer);
router.delete('/api/containers/:id/remove', container.removeContainer);

/* Image Routes */
router.get('/api/images', image.listImages);
router.get('/api/images/:id', image.listSpecificImage);
router.delete('/api/images/:id', image.removeImage);
router.get('/api/images/:id/history', image.imageHistory);
router.post('/api/images/pull/', image.pullImage);

/* Network Routes */
router.get('/api/networks', network.listNetworks);
router.get('/api/networks/:id', network.listSpecificNetwork);

module.exports = router;
