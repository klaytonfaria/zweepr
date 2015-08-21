"use strict"
module.exports = (function(obj) {
  var cli = require("cli"),
      newObj = obj || {},
      componentList = [],
      page = "";

  function createPage(data) {
    var componentName = data.name.toLowerCase(),
        componentType = data.type;

    if(componentType === "page") {
      page = componentName;
      newObj[componentName] = newObj[componentName] || {};
      cli.info(". Page found: " + page);
    } else {
      newObj[page] = newObj[componentName] || {};
    }
    return this
  };

  function addScript(data) {
    // console.log(newObj);
    var componentName = data.name.toLowerCase(),
        componentType = data.type;

    if(data.files !== undefined) {
      //createPage(data);
      //console.log(newObj[page]);
      newObj[page].scripts = newObj[page].scripts || [];
      for(var i = 0; i < data.files.length; i++) {
        newObj[page].scripts.push(data.files[i]);
      }
    }
    return this
  }

  function getComponents(data) {
    if(newObj[data.name] && data.dependencies && data.dependencies.components) {
      componentList = data.dependencies.components;
    }
    return componentList;
  }

  function getObject() {
    return newObj;
  }

  function setPageName(pageName) {
    page = pageName;
    return this;
  }

  return {
    setPageName: setPageName,
    getObject: getObject,
    getComponents: getComponents,
    createPage: createPage,
    addScript: addScript,
  }
});
