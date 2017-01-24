let express	= require('express');
let controllers = require('./controllers');

let containers = controllers.containers,
		images = controllers.images,
		networks = controllers.networks;

let router = express.Router();


/* Container Routes */
router.get('/api/containers/running', containers.listRunningContainers);
router.get('/api/containers/all', containers.listContainers);
router.get('/api/containers/:id/', containers.listSpecificContainer);
router.post('/api/containers/:id/start', containers.startContainer);
router.post('/api/containers/:id/stop', containers.stopContainer);
router.post('/api/containers/:id/pause', containers.pauseContainer);
router.post('/api/containers/:id/unpause', containers.unpauseContainer);
router.post('/api/containers/:id/restart', containers.restartContainer);
router.delete('/api/containers/:id/remove', containers.removeContainer);

/* Image Routes */
router.get('/api/images', images.listImages);
router.get('/api/images/:id', images.listSpecificImage);
router.delete('/api/images/:id', images.removeImage);
router.get('/api/images/:id/history', images.imageHistory);

/* Network Routes */
router.get('/api/networks', networks.listNetworks);
router.get('/api/networks/:id', networks.listSpecificNetwork);


module.exports = router;
