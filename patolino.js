#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    utils = require("./lib/utils"),
    helpme = require("./lib/helpme"),
    options = cli.parse(helpme);

cli.main(function(args, options) {
  var settingsGenerator = require("./lib/settingsGenerator")(options),
      content = settingsGenerator.readFile(options.cwd + options.src);
  utils.writeJson(options.dist, content);
});
