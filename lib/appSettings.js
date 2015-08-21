"use strict"
module.exports = (function(obj) {
  var extend = require('util')._extend,
      newObj = obj || {},
      componentList = [],
      page = "";

  function createPage(data) {
    if(/*data.type === "page" && */data.name !== undefined) {
      page = data.name;
      newObj[data.name] = {};
    } else {
       data.name = page;
    }
    return this
  };

  function addScript(data) {
    if(newObj[data.name] && data.files !== undefined) {
      //createPage(data);
      newObj[data.name].scripts = newObj[data.name].scripts || [];
      for(var i = 0; i < data.files.length; i++) {
        newObj[data.name].scripts.push(data.files[i]);
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

  return {
    getObject: getObject,
    getComponents: getComponents,
    createPage: createPage,
    addScript: addScript,
  }
});
