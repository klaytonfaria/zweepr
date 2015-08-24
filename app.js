#! /usr/bin/env node
"use strict"

var cli = require("cli"),
    utils = require("./lib/utils"),
    program = require("./lib/program"),
    appSettings = require("./lib/AppSettings")(),
    basePath = "/app/walmart-frontend/webstore/",
    filePath = "assets/desktop/template/**/wm-component.json",
    outputFile = "/app/walmart-frontend/webstore/settings.json";

appSettings.readFile(basePath + filePath).then(function(obj) {
  utils.writeJson(outputFile, obj);
});

function makeBoilerplate() {
  cli.info("Created initial component structure at: " + process.env.PWD);
  process.exit(1);
}
