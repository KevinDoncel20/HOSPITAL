var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Centro Médico Tu Mejor Opción' });
});

module.exports = router;
