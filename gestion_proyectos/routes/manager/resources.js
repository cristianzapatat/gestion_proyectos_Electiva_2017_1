"use strict";

var express = require('express');
var util = require('../../util/util');
var queries = require('../../util/queries');
var db = require('../../dao/db');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/resource/list');
});

router.get('/list', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let user = [req.session.user[0].id];
      db.execute(queries.listAllResources, user, (error, data) => {
        if (error) {
          res.redirect('/');
        } else {
          res.render('manager/resources/list', {
            resources: data,
            user: req.session.user[0]
          });
        }
      })
    }
  }
})

router.get('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      res.render('manager/resources/createEdit', {
        user: req.session.user[0],
        color: 'success',
        action: 'Crear',
        url: 'create'
      });
    }
  }
});

router.post('/create', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let resource = {
        name: req.body.name,
        quantity: req.body.quantity,
        ubication: req.body.ubication,
        description: req.body.description,
        user: req.session.user[0].id
      };
      let validate = util.isNotEmptyNotNull(resource.name, resource.quantity, resource.ubication, resource.description, resource.user);
      if (validate) {
        db.execute(queries.addResource, resource, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/resource/list');
          }
        });
      } else {
        res.render('manager/resources/createEdit', {
          error: 'Complete el formulario',
          action: 'Crear',
          color: 'success',
          url: 'create',
          user: req.session.user[0]
        });
      }
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
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let id = req.params.id;
      if (util.isNotEmptyNotNull(id)) {
        let array = [id, req.session.user[0].id];
        db.execute(queries.selectResource, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user == req.session.user[0].id) {
                res.render('manager/resources/createEdit', {
                  url: 'edit',
                  action: 'Editar',
                  color: 'warning',
                  resource: data[0],
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
  }
});

router.post('/edit', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.body.name, req.body.quantity, req.body.ubication, req.body.description,
        req.body.id, req.session.user[0].id
      ];
      let validate = util.isNotEmptyNotNull(array[0], array[1], array[2], array[3], array[4], array[5]);
      if (validate) {
        db.execute(queries.editResource, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            res.redirect('/resource/list');
          }
        });
      } else {
        res.redirect('/resource/list');
      }
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
    if (!req.session.user[0].state) {
      res.redirect('/');
    } else {
      let array = [req.params.id, req.session.user[0].id];
      let validate = util.isNotEmptyNotNull(array[0], array[1]);
      if (validate) {
        db.execute(queries.selectResource, array, (error, data) => {
          if (error) {
            res.redirect('/');
          } else {
            if (data.length > 0) {
              if (data[0].user == req.session.user[0].id) {
                db.execute(queries.deleteResource, array, (err, result) => {
                  if (err) {
                    res.redirect('/');
                  } else {
                    res.redirect('/resource/list');
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
  }
});

module.exports = router;
