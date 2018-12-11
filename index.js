const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const shell = require('shelljs');
const commands = require('./commands.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/res", express.static('./resources/'));

const getPwdCmd = 'sudo grep -roP "eric:.*" /etc/shadow | sed -E "s/eric:([^:]*):.*$/\1/"';

app.get('/:id', function (req, res) {
  const id = req.params.id;
  res.json(commands.get(id));
});

app.get('/remove/time/:id', function (req, res) {
  const id = req.params.id;
  commands.remove(id);
  res.json(commands.getDataIds());
});

app.get('/id/list', function (req, res) {
  res.json(commands.getDataIds());
});

app.post('/save/:id', function (req,res) {
  const id = req.params.id;
  commands.save(id, req.body);
  res.send('success');
});

console.log("Server Up!");
app.listen(3000)
