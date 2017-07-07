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
- module/component names cannot be capitalized
- ignore files
- test the folderChecker program
- change example modules folder to lowercase
- require checker
- add 2 different commands for requirechecker and folderchecker

# TODO
  - start adapting typeScript
  - allow verbose to track what folders where analyzed
    - it will be a directory tree containing all the files in the project.
    - the folders/files ignored will be grayed out

  - semantics checker
  - should be able to tell external dependencies of modules and components.
    For example, if a component called Sidebar used a helper function outside
    of his folder, this checker should tell him those dependencies.

# DONE
