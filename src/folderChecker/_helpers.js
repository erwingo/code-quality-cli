const nodeHelpers = require('node-helpers');

module.exports.getAllFilesAndFolders = (folderPath, recursive = true) => {
  return {
    files: module.exports.getAllFiles(folderPath, recursive),
    folders: nodeHelpers.file.getChildFolders(folderPath, { recursive })
  };
};

module.exports.getAllFiles = (folderPath, recursive = true) => {
  return nodeHelpers.file.getChildFiles(folderPath, { recursive })
    .filter(el => !/.empty$/.test(el));
};

module.exports.validateFolders = (folders, options = {}) => {
  folders.forEach(el => {
    const { files, folders } = module.exports.getAllFilesAndFolders(el, false);
    let isGoodFolder;

    if (options.onlyFolders) {
      isGoodFolder = files.length === 0 && folders.length > 0;
      if (!isGoodFolder) throw new Error(`${el}, must only contain folders`);
    } else if (options.onlyFiles) {
      isGoodFolder = files.length > 0 && folders.length === 0;
      if (!isGoodFolder) throw new Error(`${el}, must only contain files`);
    } else if (options.mustContainFoldersOrFilesNotBoth) {
      isGoodFolder = (files.length > 0 && folders.length === 0) ||
                      (files.length === 0 && folders.length > 0);
      if (!isGoodFolder) throw new Error(`${el}, cannot contain both files and folders`);
    } else {
      isGoodFolder = files.length > 0 || folders.length > 0;
      if (!isGoodFolder) throw new Error(`${el}, cannot be empty`);
    }

    if (!options.canContainUnderscoreFolders) {
      isGoodFolder = isGoodFolder &&
                      folders
                        .map(el => el.split('/').pop())
                        .every(el => el[0] !== '_');

      if (!isGoodFolder) throw new Error(`${el}, cannot contain _ folder(s)`);
    }

    if (!options.canContainUnderscoreFiles) {
      isGoodFolder = isGoodFolder &&
                      files
                        .map(el => el.split('/').pop())
                        .every(el => el[0] !== '_');

      if (!isGoodFolder) throw new Error(`${el}, cannot contain _ file(s)`);
    }
  });
};
