"use strict"
module.exports = (function(options) {
  var cli = require("cli"),
      glob = require("glob"),
      json = require("jsonfile"),
      utils = require("../lib/utils"),
      newObj = {},
      page = "",
      output = [];

  function createPage(data) {
    var componentName = data.name.toLowerCase(),
        componentType = data.type;

    if(componentType === "page") {
      page = componentName;
      newObj[componentName] = newObj[componentName] || {};
      if(options.verbose) {
        cli.info(". Page found: " + "\x1b[33m" + page);
      }
    }
  };

  function addScript(data) {
    if(data.files) {
      newObj[page].scripts = newObj[page].scripts || [];
      for(var i = 0; i < data.files.length; i++) {
        if(options.verbose) {
          cli.info("  - script found: " + data.files[i]);
        }
        newObj[page].scripts.push(data.files[i]);
      }
    }
    if(data.dependencies && data.dependencies.scripts) {
      var scripts =  data.dependencies.scripts;
      newObj[page].scripts = newObj[page].scripts || [];
      for(var i = 0; i < scripts.length; i++) {
        if(options.verbose) {
          cli.info("  - script found: " + scripts[i]);
        }
        newObj[page].scripts.push(scripts[i]);
      }
    }
  }

  function readFile(file, registeredComponent) {
    var fileList = glob.sync(file),
        registeredComponents = [];

    for(var i = 0; i < fileList.length; i++) {
      var obj = json.readFileSync(fileList[i], {throws : true}) || null;
      if(obj) {
        var componentName = obj.name.toLowerCase(),
            componentType = obj.type || "",
            isPage = false;

        if(componentType.toLowerCase() === "page") {
          isPage = true;
          page = componentName;
          registeredComponents = registeredComponent || [];
        }
        createPage(obj);
        if(options.verbose) {
          cli.info("└── Component found: " + componentName);
        }
        addScript(obj);
        var components = getComponents(obj);
        if(components.length >= 0) {
          for(var i2 = 0; i2 < components.length; i2++) {
            // Prevent duplicated components
            if(registeredComponents.indexOf(componentName) <= 0) {
              registeredComponents.push(componentName);
              readFile(components[i2], registeredComponents);
            }
          }
        }
      } else {
        cli.fatal("Syntax error, malformed JSON: " + "\x1b[33m" +fileList[i]);
      }
    }
    if(isPage) {
      output = newObj;
    }

    return output;
  }

  function getComponents(data) {
    var componentList = [];
    if(data.dependencies && data.dependencies.components) {
      componentList = data.dependencies.components;
    }
    return componentList;
  }

  function getObject() {
    return convertListToObject(newObj);
  }


  return {
    readFile: readFile
  }
});
