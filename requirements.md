```
Dashboard (module)
|-- index.js (entry file)
|-- _components (_components folder)
    |-- Sidebar (component folder)
        |-- index.js (entry file)
```

- module can contain _ folders (_fonts, _tests, _css, _media, _components, _helpers, _vendors)
- _components folder can only have component folders
- component folders can contain _ folders (_fonts, _tests, _css, _media,
  _components, _helpers, _vendors)
- index file is the entry file for the module/components

- _fonts (only font files can be here)
- _css (only css files and subdirs can be here)
- _media (only images/videos aund subdirs can be here)
- _components (can have any of the other files)
- _helpers (useful functions that can be astracted/constants)
- _vendors (only external libraries/frameworks can be here)
- file names must only contain english alphabet characters, can only start with _ or letter,
  can only end with extensions (.jpg, .png, .css, .scss, .js), non extension part of the
  name can only finish with letter or number, can contain -, _.
  valid: erwin.js, _erwin.js, erwingo.png, erwin1.js, erwinGaitan.js, erwin-gaitan2.js, erwin_gaitan.jpg
  invalid: 4erwin.js, -erwin.js, erwin gaitan.js
