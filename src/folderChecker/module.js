const helpers = require('./_helpers');

const validUnderscoreFolders = [
  '_tests',
  '_helpers',
  '_css',
  '_components',
  '_media',
  '_vendors',
  '_fonts'
];

module.exports.validateModule = dirPath => {
  const folders = helpers.getAllFolders(dirPath, true);
  helpers.validateFolders([dirPath], { canContainUnderscoreFolders: true });

  folders.forEach(el => {
    const name = el.split('/').pop();

    if (name[0] === '_' && !validUnderscoreFolders.includes(name)) {
      throw new Error(`${el}, invalid _ folder`);
    }
  });

  const moduleFolders = folders.concat(dirPath)
    .filter(el => /[A-Z]/.test(el.split('/').pop()[0]));

  moduleFolders.forEach(el => {
    helpers.validateFolders([el], { canContainUnderscoreFolders: true });

    helpers.getAllFiles(el).forEach(el => {
      const fileExt = helpers.getFileExtension(el);
      if (fileExt !== 'js') throw Error(`${el}, invalid file extension`);
      if (/[A-Z]/.test(el.split('/').pop()[0])) {
        throw new Error(`${el}, cannot have capitalized name`);
      }
    });
  });
};
