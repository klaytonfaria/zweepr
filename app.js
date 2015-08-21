#!/usr/bin/env node
"use strict"

var Q = require("q"),
    cli = require("cli"),
    glob = require("glob"),
    json = require("jsonfile"),
    extend = require("util")._extend,
    program = require("./lib/program"),
    filePath = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputFile = "/app/walmart-frontend/webstore/settings.json",
    page,
    output = [];

function readFile(file) {
  var deferred = Q.defer(),
      fileList = glob.sync(file);

  for(var i = 0; i < fileList.length; i++) {
    var obj = json.readFileSync(fileList[i]),
        componentName = obj.name.toLowerCase(),
        componentType = obj.type || "";

    if(componentType.toLowerCase() === "page") {
      page = componentName;
    }

    var resultObj = appSettings().setPageName(page).createPage(obj).addScript(obj),
        componentList = resultObj.getComponents(obj);

    cli.info("└── Component found: " + componentName);

    if(componentList.length > 0) {
      for(var i2 = 0; i2 < componentList.length; i2++) {
        readFile(componentList[i2]);
      }
    }

    output.push(resultObj.getObject());
  }

  deferred.resolve(output);
  return deferred.promise;
}


function convertListToObject(list) {
  var obj = {};

  for(var i = 0; i < list.length; i++) {
    // console.log(list[i]);
    var key = "key" + i;
    var pageKey = Object.keys(list[i])[0];

    obj[pageKey] = obj[pageKey] || {};
    if(list[i][pageKey].scripts) {
      obj[pageKey].scripts = obj[pageKey].scripts || [];
      obj[pageKey].scripts = obj[pageKey].scripts.concat(list[i][pageKey].scripts).reverse();
    }
    if(list[i][pageKey].styles) {
      obj[pageKey].styles = obj[pageKey].styles || [];
      obj[pageKey].styles = obj[pageKey].styles.concat(list[i][pageKey].styles).reverse();
    }
  }

  return obj;
}

function writeJson(filePath, obj) {
  json.writeFileSync(filePath, obj, {spaces: 2}, function (err) {
    cli.error(err);
  })
  cli.ok("File created in: " + filePath);
}

function makeBoilerplate() {
  cli.info("Created initial component structure at: " + process.env.PWD);
  process.exit(1);
}


readFile(filePath).then(function(obj) {
  writeJson(outputFile, convertListToObject(obj));
});
