Patolino
===

Create settings file with all dependencies of components inside of page

### Getting Started
#### Create a component.json with type:"page"
```javascript
// assets/desktop/home/js/wm-component.json
{
  "name": "home",
  "device": "desktop",
  "type": "page",
  "description": "Home walmart.com.br",
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
$ git clone https://gitlab.com/klaytonfaria/patolino.git
$ cd patolino -h

Usage:
  patolino.js [OPTIONS] [ARGS]

Options:
      --cwd [STRING]     work directory (Default is /app/walmart-frontend/webstore/)
      --src [STRING]     file(s) directory (Default is assets/desktop/template/**/wm-component.json)
      --dist [STRING]    output file directory (Default is /app/walmart-frontend/webstore/settings.json)
  -h, --help             Display help and usage details
```

### Output
---
Running command bellow, Patolino will create a json senttings with all dependencies inside your page ;)

```bash
patolino --cwd="assets/" --src="desktop/**/component.json" --dist="settings-desktop.json"
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
