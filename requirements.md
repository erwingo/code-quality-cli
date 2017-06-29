# FOLDER CHECKER

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
  - components inside _components subfolders are only meant to be used inside that scope
- _helpers (useful functions that can be astracted/constants)
  - helpers inside _helpers subfolders are only meant to be used inside that scope
- _vendors (only external libraries/frameworks can be here)
- file names must only contain english alphabet characters, can only start with _ or letter,
  can only end with extensions (.jpg, .png, .css, .scss, .js, .woff), non extension part of the
  name can only finish with letter or number, can contain -, _.
  valid: erwin.js, _erwin.js, erwingo.png, erwin1.js, erwinGaitan.js, erwin-gaitan2.js, erwin_gaitan.jpg
  invalid: 4erwin.js, -erwin.js, erwin gaitan.js

- you should be able to type `code-quality [folderPath]` and start inspecting
- should allow to exclude/include folders/files using glob pattern
- should allow config things go in a `.codeQuality` file located at the root

# REQUIRE CHECKER

The idea of this module is to verify that all files are being required so that we don't
have any file hanging there for the sake of only being there.

- if there are js/json files not being required, an error should be thrown listing them
- if there are files not being required an error should be thrown and list them:
  - js, json
  - css, scss
  - png, jpg, mp4
  - svg, woff

# SEMANTICS CHECKER

The idea of this module is to verify that the code inside files is being
used (dead code verification), the code is in the correct section (folder hierarchy)
so that the code is well spread and in the right place at all times.
For example, if you have a helpers function that is only used in one module, it should
be inside that module only, not in any parents module.
