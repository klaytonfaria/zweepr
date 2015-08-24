"use strict"
module.exports = (function(obj) {
  var Q = require("q"),
      cli = require("cli"),
      glob = require("glob"),
      json = require("jsonfile"),
      utils = require("../lib/utils"),
      newObj = obj || {},
      page = "",
      output = [],
      componentList = [],
      registeredComponent = [];

  function createPage(data) {
    var componentName = data.name.toLowerCase(),
        componentType = data.type;

    if(componentType === "page") {
      page = componentName;
      newObj[componentName] = newObj[componentName] || {};
      cli.info(". Page found: " + "\x1b[33m" + page);
    }
  };

  function addScript(data) {
    var componentName = data.name.toLowerCase();
    if(data.files) {
      newObj[page].scripts = newObj[page].scripts || [];
      for(var i = 0; i < data.files.length; i++) {
        newObj[page].scripts.push(data.files[i]);
      }
    }
  }

  function readFile(file) {
    var deferred = Q.defer(),
        fileList = glob.sync(file);

    for(var i = 0; i < fileList.length; i++) {
      var obj = json.readFileSync(fileList[i]),
          componentName = obj.name.toLowerCase(),
          componentType = obj.type || "",
          isPage = false;

      if(componentType.toLowerCase() === "page") {
        isPage = true;
        page = componentName;
        registeredComponent = [];
      }

      createPage(obj);
      addScript(obj);
      var components = getComponents(obj);

      if(components.length > 0) {
        for(var i2 = 0; i2 < components.length; i2++) {
          // Prevent duplicated components
          if(registeredComponent.indexOf(componentName) < 0) {
            cli.info("└── Component found: " + componentName);
            registeredComponent.push(componentName);
            readFile(components[i2]);
          }
        }
      }
    }
    if(isPage) {
      output = newObj;
    }

    deferred.resolve(output);
    return deferred.promise;
  }

  function getComponents(data) {
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
