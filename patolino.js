#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    utils = require("./lib/utils"),
    helpme = require("./lib/helpme"),
    options = cli.parse(helpme),
    settingsGenerator = require("./lib/settingsGenerator")();


cli.main(function(args, options) {
  try {
      var content = settingsGenerator.readFile(options.cwd + options.src);
      utils.writeJson(options.dist, content);
  } catch (err) {
      cli.fatal(err);
  }
});
