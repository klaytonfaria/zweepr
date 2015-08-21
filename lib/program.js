"use strict"
module.exports = (function(obj) {
  var program = require("commander"),
      app = require("../app");

  program
  .version("0.1.0")
  .option("-i, --init", "make initial component structure", app.makeBoilerplate)
  .on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ node app --help");
    console.log("    $ node app -h");
    console.log("");
  })
  .parse(process.argv);
})();
