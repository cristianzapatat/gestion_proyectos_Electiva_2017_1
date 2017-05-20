"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  req.session.activity = null;
  req.session.task = null;
  res.redirect('/listactivity/list');
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
        req.session.activity = null;
        req.session.task = null;
        let array = [req.session.user[0].id, req.session.project[0].id];
        db.execute(queries.listActivitiesByIntegrant, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.render('integrant/listActivity', {
              activities: data,
              user: req.session.user[0],
              project: req.session.project[0].name
            });
          }
        });
      }
    }
  }
});

router.get('/get', (req, res) => {
  res.redirect('/listactivity/list');
});

router.get('/get/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      if (!req.session.project) {
        res.redirect('/integrant/projects');
      } else {
        let id = req.params.id;
        if (util.isNotEmptyNotNull(id)) {
          let array = [id, req.session.user[0].id];
          db.execute(queries.selectActivityByIntegrant, array, (error, data) => {
            if (error) {
              res.redirect('/listactivity/list');
            } else {
              req.session.activity = data[0].id;
              req.session.task = null;
              res.redirect('/listtask/list');
            }
          });
        } else {
          res.redirect('/listactivity/list');
        }
      }
    }
  }
});

module.exports = router;
