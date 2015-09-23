"use strict"
module.exports = (function(options) {
  var cli = require("cli"),
      glob = require("glob"),
      json = require("jsonfile"),
      utils = require("../lib/utils"),
      newObj = {},
      page = null,
      output = [];

  function createPage(data) {
    var componentName = data.name,
        componentType = data.type;

    if(componentType === "page") {
      page = componentName;
      newObj[componentName] = newObj[componentName] || {};
      if(options.verbose || options["verbosePages"]) {
        cli.info(". Page found: " + "\x1b[33m" + page);
      }
    }
  };

  function addScript(data) {
    if(data.files && data.files.length > 0) {
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
        registeredComponents = [],
        shouldBeAPage = !registeredComponent ? true : false;

    for(var i = 0; i < fileList.length; i++) {
      var obj = json.readFileSync(fileList[i], {throws : true}) || null;
      var shoulContinue = validateObject(obj, fileList[i], shouldBeAPage);
      if(shoulContinue) {
        try {
          var componentName = obj.name.toLowerCase(),
              componentType = obj.type,
              isPage = false;

          if(componentType.toLowerCase() === "page") {
            isPage = true;
            page = componentName;
            registeredComponents = registeredComponent || [];
          } else {
            isPage = false;
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
        } catch (e) {
          cli.fatal(e + " | File: " + "\x1b[33m" + fileList[i]);
        }
      }
      if(isPage) {
        output = newObj;
      }
    }

    return output;
  }

  function validateObject(obj, file, shouldBeAPage) {
    var shouldContinue  = true;
    if(!obj) {
      cli.fatal("Syntax error, malformed JSON on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("name")) {
      cli.fatal("The property \"name\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("device")) {
      cli.fatal("The property \"device\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("type")) {
      cli.fatal("The property \"type\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("description")) {
      cli.fatal("The property \"description\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("repository")) {
      cli.fatal("The property \"repository\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("language")) {
      cli.fatal("The property \"language\" is required as String on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("files")) {
      cli.fatal("The property \"files\" is required as Array on file: " + "\x1b[33m" + file);
    }
    if(!obj.hasOwnProperty("dependencies")) {
      cli.fatal("The property \"dependencies\" is required as Object on file: " + "\x1b[33m" + file);
    }
    if(!obj.dependencies.hasOwnProperty("scripts")) {
      cli.fatal("The property \"scripts\" is required as Array in \"dependencies\" property (Object) on file: " + "\x1b[33m" + file);
    }
    if(!obj.dependencies.hasOwnProperty("components")) {
      cli.fatal("The property \"components\" is required as Array in \"dependencies\" property (Object) on file: " + "\x1b[33m" + file);
    }
    if(shouldBeAPage && obj.type !== "page") {
      // cli.error(obj.name);
      shouldContinue = false;
    }
    return shouldContinue;
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
