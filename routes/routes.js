const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const middleware = require('../middlewares');

router.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

// router.get('/data', dataController.getData);
router.get('/user', middleware.verifyToken, dataController.getUser);
router.get('/scores', dataController.getScores);
router.post('/score', dataController.setScore);
router.post('/login', dataController.login);
router.post('/register', dataController.register);
router.post('/logout', dataController.logout);

module.exports = router;