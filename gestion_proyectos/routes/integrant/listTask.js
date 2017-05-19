"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/listtask/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      if (!req.session.project) {
        res.redirect('/integrant/projects');
      } else {
        if (!req.session.activity) {
          res.redirect('/listactivity/list');
        } else {
          res.render('integrant/listTaks', {
            user: req.session.user[0],
            project: req.session.project[0].name
          });
        }
      }
    }
  }
});

module.exports = router;
