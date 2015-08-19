"use strict"
module.exports = (function(obj) {
  var extend = require('util')._extend,
      Q = require("q"),
      newObj = obj || {};

  function createPage(data) {
    if(data.type === "page" && data.name !== undefined) {
      newObj[data.name] = {};
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

  function getObject() {
    return newObj;
  }

  return {
    getObject: getObject,
    createPage: createPage,
    addScript: addScript,
  }
});
