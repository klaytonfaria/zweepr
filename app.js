#!/usr/bin/env node
"use strict"

var cli = require("cli"),
    glob = require("glob"),
    json = require("jsonfile"),
    file = "/app/walmart-frontend/webstore/assets/desktop/template/**/wm-component.json",
    appSettings = require("./lib/AppSettings"),
    outputSettings = {
      "settings": []
    };


    step(function() {
        console.log(1)
        next;
      },
      function() {
        console.log(2);
      },
      function() {
        console.log(3);
      });


function readJson(file) {

  glob(file, function(err, files) {

    for(var i = 0; i < files.length; i++) {
      json.readFile(files[i], function(err, obj) {
        var jsonSettings = appSettings()
          .createPage(obj)
          .addScript(obj)
          .getObject();
          outputSettings.settings.push(jsonSettings);
          console.log(JSON.stringify(outputSettings));
      });

      if(i === (files.length -1)) {
        console.log(JSON.stringify(outputSettings));
      }
    }

  });

}

readJson(file);
