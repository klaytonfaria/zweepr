#! /usr/bin/env node
"use strict"

var cli = require("cli"),
    utils = require("./lib/utils"),
    helpme = require("./lib/helpme"),
    options = cli.parse(helpme),
    settingsGenerator = require("./lib/settingsGenerator")();

cli.main(function(args, options) {  
  settingsGenerator.readFile(options.cwd + options.src).then(function(obj) {
    utils.writeJson(options.dist, obj);
  }, function(err) {
    cli.fatal(err);
  });
});

function makeBoilerplate() {
  cli.info("Created initial component structure at: " + process.env.PWD);
  process.exit(1);
}
