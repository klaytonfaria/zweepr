#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    glob = require("glob"),
    json = require("jsonfile"),
    program = require("commander"),
    filePath = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputFile = "/app/walmart-frontend/webstore/settings.json",
    output = [];


    program
      .version('0.1.0')
      .option('-i, --init', 'make initial component structure')      

    program.on('--help', function(){
      console.log('  Examples:');
      console.log('');
      console.log('    $ node app --help');
      console.log('    $ node app -h');
      console.log('');
    });

    program.parse(process.argv);




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
