"use strict"
module.exports = (function(obj) {
  var cli = require("cli"),
      json = require("jsonfile");

  function returnUnicArrays(arr) {
    try {
      var filteredArray = arr.filter(function(item, pos) {
        return arr.indexOf(item) == pos;
      });
    } catch (e) {
       showError(e);
    }
    return filteredArray;
  }

  function writeJson(filePath, obj) {
    json.writeFileSync(filePath, obj, {spaces: 2}, function (err) {
      cli.error(err);
    })
    cli.ok("File created in: \x1b[92m" + filePath);
  }

  function showError(msg) {
    cli.err(msg);
    process.exit(1);
  }

  return {
    returnUnicArrays: returnUnicArrays,
    writeJson: writeJson,
    showError: showError
  }
})();
