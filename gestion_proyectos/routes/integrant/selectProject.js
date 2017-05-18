"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/projects', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.session.user[0].id];
      db.execute(queries.listProjectByIntegrant, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.render('integrant/selectProject', {
            user: req.session.user[0],
            projects: data,
            layout: 'master_page_integrant'
          })
        }
      });
    }
  }
});

router.get('/select', (req, res) => {
  res.redirect('/integrant/projects');
});

router.get('/select/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      if (util.isNotEmptyNotNull(req.params.id)) {
        let array = [req.session.user[0].id, req.params.id];
        db.execute(queries.selectProjectByIntegrant, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              req.session.project = data;
              res.redirect('/');
            } else {
              res.redirect('/');
            }
          }
        });
      } else {
        res.redirect('/');
      }
    }
  }
});

router.get('/out', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (req.session.user[0].state) {
      res.redirect('/');
    } else {
      if (!req.session.project) {
        res.redirect('/integrant/projects');
      } else {
        req.session.project = null;
        res.redirect('/');
      }
    }
  }
});

module.exports = router;
