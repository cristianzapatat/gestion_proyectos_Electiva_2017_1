"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/charges/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.session.user[0].id];
    db.execute(queries.listPositionByUser, array, (error, data) => {
      if (error) {
        res.redirect('/');
      } else {
        res.render('charges/list', {
          charges: data
        })
      }
    });
  }
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.session.user[0].id];
    db.execute(queries.listPositionByUser, array, (error, data) => {
      if (error) {
        res.redirect('/');
      } else {
        db.execute(queries.listProjectByUser, array, (fail, result) => {
          if (fail) {
            res.redirect('/');
          } else {
            res.render('charges/list', {
              projects: result,
              charges: data
            })
          }
        });
      }
    });
  }
});

router.get('/list/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.session.user[0].id, req.params.id];
    let validateCharge = util.isNotEmptyNotNull(array[0], array[1]);
    if (validateCharge) {
      db.execute(queries.listPositionByProject, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          let user = [array[0]];
          db.execute(queries.listProjectByUser, user, (fail, result) => {
            if (fail) {
              res.redirect('/');
            } else {
              res.render('charges/list', {
                projects: result,
                charges: data
              })
            }
          });
        }
      });
    } else {
      res.redirect('/charges/list');
    }
  }
});

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let user = [req.session.user[0].id];
    db.execute(queries.listProjectByUser, user, (error, data) => {
      if (error) {
        res.redirect('/');
      } else {
        if (data.length > 0) {
          res.render('charges/createEdit', {
            visible: true,
            projects: data
          });
        } else {
          res.render('charges/createEdit', {
            visible: false
          });
        }
      }
    });
  }
});

module.exports = router;
