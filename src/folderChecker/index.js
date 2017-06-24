const nodeHelpers = require('node-helpers');

function getFilesAndFolders(folderPath) {
  return {
    files: nodeHelpers.file.getChildFiles(folderPath, { recursive: true }),
    folders: nodeHelpers.file.getChildDirs(folderPath, { recursive: true })
  };
}

function validateNonEmptyAndNoUnderscoreFolders(folders) {
  folders.forEach(el => {
    const isGoodFolder = (nodeHelpers.file.getChildFiles(el).length >= 1 ||
                          nodeHelpers.file.getChildDirs(el).length >= 1) &&
                          el.split('/').pop()[0] !== '_';

    if (isGoodFolder) return;
    throw new Error(`${el} no empty/underscore folders`);
  });
}

module.exports.validateUnderscoreCssFolder = folderPath => {
  const { files, folders } = getFilesAndFolders(folderPath);
  if (files.length === 0) throw new Error('should have files');
  validateNonEmptyAndNoUnderscoreFolders(folders);

  files.forEach(el => {
    if (/\.(css|scss)$/.test(el)) return;
    throw new Error(`${el}, only css/scss files`);
  });
};

module.exports.validateUnderscoreFontFolder = folderPath => {
  const { folders } = getFilesAndFolders(folderPath);
  validateNonEmptyAndNoUnderscoreFolders(folders);

  const rootFolders = nodeHelpers.file.getChildDirs(folderPath);

  if (rootFolders.length === 0) throw new Error(`${folderPath}, must contain at least 1 font folder`);

  folders.forEach(el => {
    const files = nodeHelpers.file.getChildFiles(el).map(el => el.split('/').pop());
    const folders = nodeHelpers.file.getChildDirs(el);

    if (files.length === 0 && folders.length > 0) return;

    if (files.length > 0 && folders.length === 0) {
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
    } else {
      throw new Error(`${el}, should only contain folders or files not both at the same time`);
    }
  });
};
