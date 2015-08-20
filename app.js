#!/usr/bin/env node
"use strict"

var Q = require("q"),
    cli = require("cli"),
    glob = require("glob"),
    json = require("jsonfile"),
    program = require("commander"),
    filePath = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputFile = "/app/walmart-frontend/webstore/settings.json",
    output = [];


    program
      .version('0.1.0')
      .option('-i, --init', 'make initial component structure', makeBoilerplate)
      .on('--help', function(){
        console.log('  Examples:');
        console.log('');
        console.log('    $ node app --help');
        console.log('    $ node app -h');
        console.log('');
      })
      .parse(process.argv);


function makeBoilerplate() {
  cli.info("Created initial component structure at: " + process.env.PWD);
  process.exit(1);
}


function readFile(file) {
  var deferred = Q.defer(),
      fileList = glob.sync(file);

      // console.log("--->", fileList);

  for(var i = 0; i < fileList.length; i++) {
    var obj = json.readFileSync(fileList[i]),
        resultObj = appSettings()
                    .createPage(obj)
                    .addScript(obj),
        componentList = resultObj.getComponents(obj);
    cli.info("Component found: " + obj.name);

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



function writeJson(filePath, obj) {
  json.writeFileSync(filePath, obj, {spaces: 2}, function (err) {
    cli.error(err);
  })
  cli.ok("File created in: " + filePath);
}

readFile(filePath).then(function(obj){
  writeJson(outputFile, obj);
});
