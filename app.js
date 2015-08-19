#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    glob = require("glob"),
    json = require("jsonfile"),
    filePath = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputFile = "/app/walmart-frontend/webstore/settings.json",
    output = [];

function readJson(filePath) {
  glob(filePath, function(err, files) {
    for(var i = 0; i < files.length; i++) {
      cli.info("Found component: " + files[i]);
      var obj = json.readFileSync(files[i]),
          newObject = appSettings()
                      .createPage(obj)
                      .addScript(obj)
                      .getObject();

      output.push(newObject);
    }
  });
}

function writeJson(filePath, obj) {
  json.writeFileSync(filePath, obj, {spaces: 2}, function (err) {
    cli.info(err);
  })
  cli.info("creating " + filePath);
}

readJson(filePath);
writeJson(outputFile, output);
