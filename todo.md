- filename validations
- single folders
  - _css (only css files can be here)
  - _fonts (only font folders)
    - should have 1 index.scss|index.json file refering to his font files
  - _media (only images/videos can be here)
  - _helpers (useful functions that can be astracted/constants)
    - only js files, folders and _helpers can be here
  - _vendors (only external libraries/frameworks can be here)
- _components folders
- Module folders

# TODO
  - should be able to tell external dependencies of modules and components.
    For example, if a component called Sidebar used a helper function outside
    of his folder, this checker should tell him those dependencies.

# DONE
