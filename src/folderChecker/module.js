const nodeHelpers = require('node-helpers');
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

const validUnderscoreFiles = ['_tests', '_helpers'];
const validExtensions = ['js', 'json'];

function getChildModules(dirPath) {
  const folders = helpers.getAllFolders(dirPath);
  const moduleFolders = folders
    .filter(el => el.split('/').pop()[0] !== '_');

  if (moduleFolders.length === 0) return [];

  return moduleFolders.reduce((result, el) => {
    return result.concat(getChildModules(el));
  }, moduleFolders);
}

module.exports.validateModule = (dirPath, ignoreFolders = [], ignoreFiles = []) => {
  getChildModules(dirPath).concat(dirPath)
    .filter(el => ignoreFolders.every(el2 => el.indexOf(el2) !== 0))
    .forEach(el => {
      helpers.validateFolders(
        [el],
        { canContainUnderscoreFolders: true, canContainUnderscoreFiles: true }
      );

      let containUnderscoreHelpersFolder;
      let containUnderscoreTestsFolder;

      helpers.getAllFolders(el)
        .filter(el => ignoreFolders.every(el2 => el.indexOf(el2) !== 0))
        .forEach(el => {
          const name = el.split('/').pop();

          if (name[0] === '_') {
            if (!validUnderscoreFolders.includes(name)) throw new Error(`${el}, invalid _ folder`);
            if (name === '_helpers') containUnderscoreHelpersFolder = true;
            else if (name === '_tests') containUnderscoreTestsFolder = true;
          }

          if (/[A-Z]/.test(name[0])) {
            throw new Error(`${el}, cannot have capitalized name`);
          }
        });

      let containUnderscoreHelpersFile;
      let containUnderscoreTestsFile;

      helpers.getAllFiles(el)
        .filter(el => ignoreFiles.every(el2 => el.indexOf(el2) !== 0))
        .forEach(el => {
          const fileExt = nodeHelpers.file.getFileExtension(el);
          const basename = nodeHelpers.file.getFileBasename(el);

          if (!validExtensions.includes(fileExt)) throw Error(`${el}, invalid file extension`);

          if (basename[0] === '_') {
            if (!validUnderscoreFiles.includes(basename)) throw new Error(`${el}, invalid _ file`);

            if (basename === '_helpers') containUnderscoreHelpersFile = true;
            else if (basename === '_tests') containUnderscoreTestsFile = true;
          }
        });

      if (containUnderscoreHelpersFile && containUnderscoreHelpersFolder) {
        throw new Error(`${el}, cannot have both file and folder _helpers`);
      }

      if (containUnderscoreTestsFile && containUnderscoreTestsFolder) {
        throw new Error(`${el}, cannot have both file and folder _tests`);
      }
    });
};
