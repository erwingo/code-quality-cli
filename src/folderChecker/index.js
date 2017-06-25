const nodeHelpers = require('node-helpers');

function getAllFilesAndFolders(folderPath) {
  return {
    files: nodeHelpers.file.getChildFiles(folderPath, { recursive: true }),
    folders: nodeHelpers.file.getChildFolders(folderPath, { recursive: true })
  };
}

function validateFolders(folders, options = {}) {
  folders.forEach(el => {
    const files = nodeHelpers.file.getChildFiles(el);
    const folders = nodeHelpers.file.getChildFolders(el);
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
}

module.exports.validateUnderscoreCssFolder = folderPath => {
  const { files, folders } = getAllFilesAndFolders(folderPath);
  if (files.length === 0) throw new Error(`${folderPath}, should have files`);
  validateFolders(folders);

  files.forEach(el => {
    if (!/\.(css|scss)$/.test(el)) throw new Error(`${el}, only css/scss files`);
  });
};

module.exports.validateUnderscoreFontsFolder = folderPath => {
  const { folders } = getAllFilesAndFolders(folderPath);

  validateFolders(folders, { mustContainFoldersOrFilesNotBoth: true });
  validateFolders([folderPath], { onlyFolders: true });

  folders.forEach(el => {
    const files = nodeHelpers.file.getChildFiles(el).map(el => el.split('/').pop());
    const folders = nodeHelpers.file.getChildFolders(el);

    if (files.length === 0 && folders.length > 0) return;
    validateFolders(folders, { mustContainFoldersOrFilesNotBoth: true });

    if (files.includes('index.scss')) {
      const hasGoodFontFiles = files
        .filter(el => el !== 'index.scss')
        .every(el => /\.woff$/.test(el));

      if (hasGoodFontFiles) return;
      throw new Error(`${el}, should only contain woff files`);
    } else if (files.includes('index.json')) {
      const hasGoodFontFiles = files
        .filter(el => el !== 'index.json')
        .every(el => /\.svg$/.test(el));

      if (hasGoodFontFiles) return;
      throw new Error(`${el}, should only contain svg files`);
    } else {
      throw new Error(`${el}, should include a index.(json|scss) file`);
    }
  });
};

module.exports.validateUnderscoreMediaFolder = folderPath => {
  const { files, folders } = getAllFilesAndFolders(folderPath);

  validateFolders([folderPath]);
  validateFolders(folders);

  files.map(el => el.split('/').pop()).forEach(el => {
    if (!/\.(jpg|png|mp4)$/.test(el)) throw new Error(`${el}, invalid file`);
  });
};

module.exports.validateUnderscoreHelpersFolder = folderPath => {
  const { files, folders } = getAllFilesAndFolders(folderPath);

  validateFolders([folderPath], { canContainUnderscoreFolders: true });
  validateFolders(folders, { canContainUnderscoreFolders: true });

  // Check all files are js
  files.map(el => el.split('/').pop()).forEach(el => {
    if (!/\.js$/.test(el)) throw new Error(`${el}, invalid file`);
  });

  // Check folders can only contain _helpers but only if other files at same level
  folders.concat([folderPath]).forEach(el => {
    const name = el.split('/').pop();
    if (el !== folderPath && name[0] === '_' && name !== '_helpers') {
      throw new Error(`${el}, only _ folders allowed are _helpers`);
    }

    const files = nodeHelpers.file.getChildFiles(el);
    const folders = nodeHelpers.file.getChildFolders(el).map(el => el.split('/').pop());

    if (folders.includes('_helpers')) {
      if ((files.length === 0 && folders.length <= 2) ||
          (files.length === 1 && folders.length === 1)) {
        throw new Error(`${el}, _helpers folder must not be here`);
      }
    }
  });
};
