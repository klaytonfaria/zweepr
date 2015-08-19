#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    Q = require("q"),
    glob = require("glob"),
    json = require("jsonfile"),
    filePath = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputFile = "/app/walmart-frontend/webstore/settings.json",
    output = [];

function writeJson(filePath, obj) {
  cli.info("creating " + filePath);
  json.writeFileSync(filePath, obj, {spaces: 2}, function (err) {
    cli.info(err);
  })
}

function readJson(filePath) {
  var deferred = Q.defer();
  glob(filePath, function(err, files) {
    for(var i = 0; i < files.length; i++) {
      var obj = json.readFileSync(files[i]),
          newObject = appSettings().createPage(obj).addScript(obj);

      output.push(newObject.getObject());
    }
        deferred.resolve(output);
  });
  return deferred.promise;
}



readJson(filePath).then(function(obj) {
  writeJson(outputFile, obj);
});
