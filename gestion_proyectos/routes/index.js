"use strict";

var express = require('express');
var util = require('../util/util');
var queries = require('../util/queries');
var db = require('../dao/db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    if (req.session.user[0].state) {
      res.render('index', {
        user: req.session.user[0]
      });
    } else {
      if (req.session.project) {
        res.render('index', {
          user: req.session.user[0],
          project: req.session.project[0].name
        });
      } else {
        res.redirect('/integrant/projects');
      }
    }
  } else {
    res.redirect('login')
  }
});

router.get('/login', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('start/login', {
      layout: false
    });
  }
});

router.get('/login/:mail', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('start/login', {
      user: req.params.mail,
      layout: false
    });
  }
});

router.post('/login', (req, res, next) => {
  var user = req.body.user;
  var pass = req.body.pass;
  if (util.isNotEmptyNotNull(user, pass)) {
    let data = [];
    data.push(user);
    data.push(pass);
    db.execute(queries.login, data, (error, result) => {
      if (error) {
        res.end();
        res.redirect('/');
      } else {
        if (result.length > 0) {
          req.session.user = result;
          res.redirect('/');
        } else {
          responseLogin(res, user);
        }
      }
    });
  } else {
    res.render('start/login', {
      user: user,
      layout: false
    });
  }
});

router.get('/logout', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    req.session.destroy();
    res.redirect('/');
  }
});

router.get('/registry', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    db.execute(queries.listTypeDocuments, (error, data) => {
      let result = {};
      result['documents'] = data;
      db.execute(queries.listTypeUsers, (error, data) => {
        result['users'] = data;
        res.render('start/registry', {
          result: result,
          resultSTR: JSON.stringify(result),
          layout: false
        });
      });
    });
  }
});

router.get('/registry/:error', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    db.execute(queries.listTypeDocuments, (error, data) => {
      let result = {};
      result['documents'] = data;
      db.execute(queries.listTypeUsers, (error, data) => {
        result['users'] = data;
        res.render('start/registry', {
          result: result,
          resultSTR: JSON.stringify(result),
          layout: false,
          error: req.params.error
        });
      });
    });
  }
});

router.post('/registry', (req, res, next) => {
  let result = req.body.resultSTR;
  let json = JSON.parse(result);
  let repeat = req.body.repeat;
  let user = {
    document: req.body.document,
    name: req.body.name,
    last_name: req.body.last_name,
    date: req.body.date,
    mail: req.body.mail,
    password: req.body.password,
    type_user: req.body.type_user,
    type_document: req.body.type_document
  };
  let validateUser = (util.isNotEmptyNotNull(user.document, user.name,
    user.last_name, user.date, user.mail, user.password, user.type_user, user.type_document));
  if ((user.password !== repeat) || !validateUser) {
    let msm = 'Las claves no coinciden';
    if (!validateUser) msm = 'Diligencie el formulario por completo';
    responseRegistry(res, msm, json, result, user);
  } else {
    db.execute(queries.insertUser, user, (error, data) => {
      if (error) {
        res.end();
        res.redirect('/registry/Error en el registro');
      } else {
        res.redirect('login/' + user.mail);
      }
    });
  }
});

function responseRegistry(res, msm, json, result, user) {
  for (let pos = 0; pos < json.documents.length; pos++) {
    if (json.documents[pos].id == user.type_document) {
      json.documents[pos]['select'] = true;
      break;
    }
  }
  for (let pos = 0; pos < json.users.length; pos++) {
    if (json.users[pos].id == user.type_user) {
      json.users[pos]['select'] = true;
      break;
    }
  }
  res.render('start/registry', {
    result: json,
    resultSTR: result,
    error: msm,
    user: user,
    layout: false
  });
}

function responseLogin(res, user) {
  res.render('start/login', {
    user: user,
    error: 'Verifique su información',
    layout: false
  });
}

module.exports = router;
