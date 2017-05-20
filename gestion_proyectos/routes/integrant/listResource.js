"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/listresource/list');
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
          if (!req.session.task) {
            res.redirect('/listtask/list');
          } else {
            let array = [req.session.task];
            db.execute(queries.listResourcesForIntegrant, array, (error, data) => {
              if (error) {
                res.redirect('/listtask/list');
              } else {
                res.render('integrant/listResource', {
                  user: req.session.user[0],
                  project: req.session.project[0].name,
                  resources: data
                });
              }
            });
          }
        }
      }
    }
  }
});

module.exports = router;
