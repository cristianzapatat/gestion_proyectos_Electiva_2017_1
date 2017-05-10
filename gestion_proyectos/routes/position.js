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
    let id = req.params.id;
    if (id == '-1') {
      res.redirect('/charges/list');
    } else {
      let array = [req.session.user[0].id, id];
      let validateCharge = util.isNotEmptyNotNull(array[0], array[1]);
      if (validateCharge) {
        let values = [id];
        db.execute(queries.selectProject, values, (error, value) => {
          if (value.length > 0) {
            db.execute(queries.listPositionByProject, array, (error, data) => {
              if (error) {
                res.redirect('/');
              } else {
                let user = [array[0]];
                db.execute(queries.listProjectByUser, user, (fail, result) => {
                  if (fail) {
                    res.redirect('/');
                  } else {
                    for (let i = 0; i < result.length; i++) {
                      if (result[i].id == id) {
                        result[i]['select'] = true;
                        break;
                      }
                    }
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
        });
      } else {
        res.redirect('/charges/list');
      }
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
            visible: false,
            projects: data,
            color: 'success',
            action: 'Crear',
            url: 'create'
          });
        } else {
          res.render('charges/createEdit', {
            visible: true,
            action: 'Crear'
          });
        }
      }
    });
  }
});

router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let charge = {
      project: req.body.project,
      name: req.body.name,
      description: req.body.description,
      salary: req.body.salary,
      schedule: req.body.schedule
    };
    let validateCharge = util.isNotEmptyNotNull(charge.project, charge.name, charge.description,
      charge.salary, charge.schedule);
    if (validateCharge) {
      db.execute(queries.crearPosition, charge, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.redirect('/charges/list');
        }
      });
    } else {
      res.render('charges/createEdit', {
        error: 'Complete el formulario',
        action: 'Crear',
        color: 'success',
        url: 'create'
      });
    }
  }
});

module.exports = router;
