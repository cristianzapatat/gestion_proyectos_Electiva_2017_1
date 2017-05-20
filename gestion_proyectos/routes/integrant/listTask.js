"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  req.session.task = null;
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
          let ids = [req.session.activity];
          req.session.task = null;
          db.execute(queries.listTaskForIntegrant, ids, (error, result) => {
            if (error) {
              res.redirect('/listactivity/list');
            } else {
              for (var i = 0; i < result.length; i++) {
                if (result[i].state == 'Aprobado') {
                  result[i]['aprobado'] = true;
                } else if (result[i].state == 'Iniciado') {
                  result[i]['iniciado'] = true;
                } else if (result[i].state == 'Procesando') {
                  result[i]['proceso'] = true;
                } else if (result[i].state == 'Finalizado') {
                  result[i]['finalizado'] = true;
                }
              }
              res.render('integrant/listTaks', {
                user: req.session.user[0],
                project: req.session.project[0].name,
                taks: result
              });
            }
          });
        }
      }
    }
  }
});

router.get('/get', (req, res) => {
  res.redirect('/listactivity/');
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
        if (!req.session.activity) {
          res.redirect('/listactivity/');
        } else {
          let id = req.params.id;
          if (util.isNotEmptyNotNull(id)) {
            let ids = [id];
            db.execute(queries.selectTaskForIntegrant, ids, (error, data) => {
              if (error) {
                res.redirect('/listactivity/');
              } else {
                req.session.task = data[0].id;
                res.redirect('/listresource/list');
              }
            });
          } else {
            res.redirect('/listactivity/');
          }
        }
      }
    }
  }
});

router.post('/edit', (req, res) => {
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
          let array = [req.body.state, req.body.id];
          db.execute(queries.updateTaskIntegrant, array, (error, data) => {
            if (error) {
              res.redirect('/');
            } else {
              res.redirect('/listtask/list');
            }
          });
        }
      }
    }
  }
});

module.exports = router;
