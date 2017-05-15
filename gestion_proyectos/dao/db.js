"use strict";

var mysql = require('mysql');

var connection;

/**
var host = "localhost";
var user = "root";
var password = "root";
var db = "gestion_proyectos";
/**/
var host = "sql10.freemysqlhosting.net";
var user = "sql10173602";
var password = "ksuMmkdDf1";
var db = "sql10173602";

function generateConnection() {
  //Connection creation
  connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
  });
  //Connection generation
  connection.connect(function(error) {
    if (error) {
      console.log('Connection problems with MySQL');
    } else {
      console.log('Connetion successful');
    }
  });
}

function getConnection() {
  if (connection === undefined) {
    generateConnection();
  }
  return connection;
}

function execute(sql, array, callback) {
  if (array === undefined) array = [];
  getConnection().query(sql, array, (error, result) => {
    if (error) callback(error, null);
    callback(error, result);
  });
}

exports.getConnection = getConnection;
exports.execute = execute;
