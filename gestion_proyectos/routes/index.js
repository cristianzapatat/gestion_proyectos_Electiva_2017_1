"use strict";

var express = require('express');
var util = require('../util/util');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('login')
});

router.get('/login', (req, res, next) => {
  res.render('start/login', {
    layout: false
  });
});

router.get('/registry', (req, res, next) => {
  res.render('start/registry', {
    layout: false
  });
});

router.post('/login', (req, res, next) => {
  var user = req.body.user;
  var pass = req.body.pass;
  if (util.isNotEmptyNotNull(user, pass)) {
    //realizar el login
  } else {
    res.render('start/login', {
      user: user,
      layout: false
    });
  }
});

module.exports = router;
