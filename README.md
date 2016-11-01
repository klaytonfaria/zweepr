Zweepr [![npm](https://img.shields.io/npm/dt/zweepr.svg)]()
===

This NPM module consolidates settings and dependencies of (and between) components. Build json files file with all dependencies of components inside of page to be used by tasks manager like gulp, grunt, broccoli, etc...

### Getting Started
#### Create a component.json with attribute type. Ex: type:"page"
```javascript
// assets/desktop/home/js/wm-component.json
{
  "name": "home",
  "device": "desktop",
  "type": "page",
  "description": "Home site.com.br",
  "repository": "https://gitrepo.url/home.git",
  "language": "assets/desktop/home/js/i18n/pt-br.json",
  "toggles": {},
  "files": [
    "assets/desktop/home/js/home.min.js"
  ],
  "dependencies": {
    "components": [
      "components/example/component.json"
    ],
    "scripts": [],
    "styles": []
  }
}
```
#### Create another component (component.json)
```javascript
// components/example/component.json
{
  "name": "component",
  "device": "desktop",  
  "description": "Component example",
  "repository": "https://gitrepo.url/component.git",
  "language": "components/example/js/i18n/pt-br.json",
  "toggles": {
    "toggle1": true,
    "toggle2": false,
  },
  "files": [
    "components/compoent-example/js/component.min.js"
  ],
  "dependencies": {
    "components": [
      "components/compoent-example-2/component.json"
    ],
    "scripts": [],
    "styles": []
  }
}
```

### Usage
---

```bash
$ git clone https://gitlab.com/klaytonfaria/zweepr.git
$ cd zweepr -h

Usage:
  zweepr [OPTIONS] [ARGS]

Options:
      --cwd [STRING]     work directory (Default is /app/)
      --src [STRING]     file(s) directory (Default is assets/*[desktop|mobile]*/**/wm-component.json)
      --dist [STRING]    output file directory (Default is /app/build/settings.json)
  -v, --verbose          output found pages, components and scritps founds
  -p, --verbosePages     output found pages founds
  -V, --version          show Zweepr version
  -h, --help             Display help and usage details
```

### Output file
---
Running command bellow, Zweepr will create a json senttings with all dependencies inside your page ;)

```bash
zweepr --cwd="assets/" --src="desktop/**/component.json" --dist="settings-desktop.json -p"
```

```javascript
//settings-desktop.json
{
  "home": {
    "scripts": [
      "assets/desktop/home/js/home.min.js",
      "components/compoent-example/js/component.min.js",
      "components/compoent-example-2/js/component.min.js"
    ]
  }
}
```
Now you can use settings-desktop.json in your grunt or gulp to help run tasks like [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat), [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify), [grunt-contrib-lint](https://github.com/gruntjs/grunt-contrib-lint), etc...
Follows an usage example:

```javascript
/*global module:false */
module.exports = function(grunt) {
  "use strict";

  var settingsApp = grunt.file.readJSON("config/settings-app.json");

  // Setting grunt app options
  grunt.config.set("options", {
      pkg: grunt.file.readJSON("package.json"),
      app: settingsApp
    }
  );

  console.log(settingsApp.home.scripts);

  // Init Grunt
  require("time-grunt")(grunt);
  require("load-grunt-config")(grunt, {
    configPath: process.cwd() + "/config/grunt/",
    init: true
  });
};

```
