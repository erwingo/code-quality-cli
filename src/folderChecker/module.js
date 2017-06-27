const helpers = require('./_helpers');
const nodeHelpers = require('node-helpers');

const validUnderscoreFolders = [
  '_tests',
  '_helpers',
  '_css',
  '_components',
  '_media',
  '_vendors',
  '_fonts'
];

function getChildModules(dirPath) {
  const folders = helpers.getAllFolders(dirPath);
  const moduleFolders = folders
    .filter(el => /[A-Z]/.test(el.split('/').pop()[0]));

  if (moduleFolders.length === 0) return [];

  return moduleFolders.reduce((result, el) => {
    return result.concat(getChildModules(el));
  }, moduleFolders);
}

module.exports.validateModule = dirPath => {
  const moduleFolders = getChildModules(dirPath);

  moduleFolders.concat(dirPath).forEach(el => {
    helpers.validateFolders([el], { canContainUnderscoreFolders: true });

    helpers.getAllFolders(el).forEach(el => {
      const name = el.split('/').pop();

      if (name[0] === '_' && !validUnderscoreFolders.includes(name)) {
        throw new Error(`${el}, invalid _ folder`);
      }
    });

    helpers.getAllFiles(el).forEach(el => {
      const fileExt = nodeHelpers.file.getFileExtension(el);
      if (fileExt !== 'js') throw Error(`${el}, invalid file extension`);
      if (/[A-Z]/.test(el.split('/').pop()[0])) {
        throw new Error(`${el}, cannot have capitalized name`);
      }
    });
  });
};
