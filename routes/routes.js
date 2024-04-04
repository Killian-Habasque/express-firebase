const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

router.get('/data', dataController.getData);
router.post('/login', dataController.login);

module.exports = router;