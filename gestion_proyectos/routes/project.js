"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('project/list');
});

router.get('/list', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.session.user[0].id];
    db.execute(queries.listProjectByUser, array, (error, data) => {
      if (error) {
        res.render('project/list', {
          error: 'No se logro cargar los proyectos',
          user: req.session.user[0]
        });
      } else {
        res.render('project/list', {
          projects: data,
          user: req.session.user[0]
        });
      }
    });
  }
});

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    res.render('project/createEdit', {
      url: 'create',
      action: 'Crear',
      color: 'success',
      user: req.session.user[0]
    });
  }
});

router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let project = {
      user: req.session.user[0].id,
      name: req.body.name,
      start: req.body.start,
      end: req.body.end,
      stage: req.body.stage
    };
    let validateProject = util.isNotEmptyNotNull(project.user, project.name,
      project.start, project.end, project.stage);
    if (validateProject) {
      db.execute(queries.createProject, project, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.redirect('/project/list');
        }
      });
    } else {
      res.render('project/createEdit', {
        error: 'Complete el formulario',
        action: 'Crear',
        color: 'success',
        url: 'create',
        user: req.session.user[0]
      });
    }
  }
});

router.get('/edit', (req, res) => {
  res.redirect('/');
})

router.get('/edit/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let id = req.params.id;
    if (util.isNotEmptyNotNull(id)) {
      let array = [id];
      db.execute(queries.selectProject, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          if (data.length > 0) {
            if (data[0].user == req.session.user[0].id) {
              if (data[0].stage == '0% – 25%') {
                data[0]['cero'] = true;
              }
              if (data[0].stage == '25% - 50%') {
                data[0]['uno'] = true;
              }
              if (data[0].stage == '50% - 75%') {
                data[0]['dos'] = true;
              }
              if (data[0].stage == '75% - 100%') {
                data[0]['tres'] = true;
              }
              res.render('project/createEdit', {
                url: 'edit',
                action: 'Editar',
                color: 'warning',
                project: data[0],
                user: req.session.user[0]
              });
            } else {
              res.redirect('/');
            }
          } else {
            res.redirect('/');
          }
        }
      });
    } else {
      res.redirect('/');
    }
  }
});

router.post('/edit', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.body.name, req.body.start, req.body.end, req.body.stage, req.body.id, req.session.user[0].id];
    let validateProject = util.isNotEmptyNotNull(array[0], array[1], array[2], array[3], array[4], array[5]);
    if (validateProject) {
      db.execute(queries.editProject, array, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.redirect('/project/list');
        }
      });
    } else {
      res.redirect('/project/list');
    }
  }
});

router.get('/delete', (req, res) => {
  res.redirect('/');
});

router.get('/delete/:id', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    let array = [req.session.user[0].id, req.params.id];
    let validateProject = util.isNotEmptyNotNull(array[0], array[1]);
    if (validateProject) {
      let ids = [array[1]];
      db.execute(queries.selectProject, ids, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          if (data.length > 0) {
            if (data[0].user == req.session.user[0].id) {
              db.execute(queries.deleteProject, array, (error, req) => {
                if (error) {
                  res.redirect('/');
                } else {
                  res.redirect('/project/list');
                }
              });
            } else {
              res.redirect('/');
            }
          } else {
            res.redirect('/');
          }
        }
      });
    } else {
      res.redirect('/');
    }
  }
});

module.exports = router;
