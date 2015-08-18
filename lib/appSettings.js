"use strict"
module.exports = (function(obj) {
  var extend = require('util')._extend;
  var newObj = obj || {};

  /**
 * createPage - Create page object.
 *
 * @param  {obj} data the obj with current conf.
 * @param  {obj} newObj the new obj.
 * @return {obj} return newObj
 */
  function createPage(data) {
    if(data.name !== undefined && data.type === "page") {
      newObj[data.name] = {};
    }
    return this
  };

  /**
 * addScript - Add scripts to page object.
 *
 * @param  {obj} data the obj with current conf.
 * @param  {obj} newObj the new obj.
 * @return {obj} return newObj
 */
  function addScript(data) {
    if(data.files !== undefined) {
      createPage(data);
      newObj[data.name].scripts = newObj[data.name].scripts || [];
      for(var i = 0; i < data.files.length; i++) {
        newObj[data.name].scripts.push(data.files[i]);
      }
    }
    return this
  }

  /**
 * getObject - Return the newObj.
 */
  function getObject() {
    return newObj;
  }

  return {
    createPage: createPage,
    addScript: addScript,
    getObject: getObject
  }
});
