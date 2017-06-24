const nodeHelpers = require('node-helpers');

function getFilesAndFolders(folderPath) {
  return {
    files: nodeHelpers.file.getChildFiles(folderPath, { recursive: true }),
    folders: nodeHelpers.file.getChildDirs(folderPath, { recursive: true })
  };
}

function validateFolders(folders, options = {}) {
  folders.forEach(el => {
    const files = nodeHelpers.file.getChildFiles(el);
    const folders = nodeHelpers.file.getChildDirs(el);
    let isGoodFolder = (files.length > 0 || folders.length > 0);

    if (!isGoodFolder) throw new Error(`${el}, cannot be empty`);

    if (options.mustContainFoldersOrFilesNotBoth) {
      isGoodFolder = (files.length >= 1 && folders.length === 0) ||
                      (files.length === 0 && folders.length >= 1);
      if (!isGoodFolder) throw new Error(`${el}, cannot contain both files and folders`);
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
  const { files, folders } = getFilesAndFolders(folderPath);
  if (files.length === 0) throw new Error(`${folderPath}, should have files`);
  validateFolders(folders);

  files.forEach(el => {
    if (/\.(css|scss)$/.test(el)) return;
    throw new Error(`${el}, only css/scss files`);
  });
};

module.exports.validateUnderscoreFontFolder = folderPath => {
  const { folders } = getFilesAndFolders(folderPath);
  validateFolders(folders, { mustContainFoldersOrFilesNotBoth: true });

  const rootFolders = nodeHelpers.file.getChildDirs(folderPath);

  if (rootFolders.length === 0) throw new Error(`${folderPath}, must contain at least 1 font folder`);

  folders.forEach(el => {
    const files = nodeHelpers.file.getChildFiles(el).map(el => el.split('/').pop());
    const folders = nodeHelpers.file.getChildDirs(el);

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
