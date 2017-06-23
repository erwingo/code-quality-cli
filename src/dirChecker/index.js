const { getChildDirs, getChildFiles } = require('/Users/erwin/Projects/node-helpers/file');

module.exports.validateUnderscoreCssFolder = folderPath => {
  const files = getChildFiles(folderPath, { recursive: true });
  const folders = getChildDirs(folderPath, { recursive: true });

  if (files.length === 0) {
    throw new Error('should have files');
  }

  folders.forEach(el => {
    const isGoodFolder = (getChildFiles(el).length >= 1 ||
      getChildDirs(el).length >= 1) &&
      el.split('/').pop()[0] !== '_';

    if (isGoodFolder) return;
    throw new Error(`${el} no empty/underscore folders`);
  });

  files.forEach(el => {
    if (/\.(css|scss)$/.test(el)) return;
    throw new Error(`${el}, only css/scss files`);
  });
};
