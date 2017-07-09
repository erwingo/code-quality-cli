const fs = require('fs-extra');
const srcHelpers = require('../_helpers');
const helpers = require('./_helpers');
const filenameChecker = require('./filename');
const componentChecker = require('./component');
const moduleChecker = require('./module');
const singleFolderChecker = require('./singleFolder');

module.exports.run = (rootPath, ignoreFolders = [], ignoreFiles = [], options = {}) => {
  if (!fs.pathExistsSync(rootPath)) throw new Error(`${rootPath}, does not exist`);
  if (!fs.statSync(rootPath).isDirectory()) throw new Error(`${rootPath}, should be a directory`);

  let { files, folders } = helpers.getAllFilesAndFolders(rootPath, true);

  files = files
    .filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0))
    .filter(el => !ignoreFiles.some(el2 => el.indexOf(el2) === 0));

  folders = folders.filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0));

  // folders/filenames validations

  files.forEach(filenameChecker.validateFilename);
  folders.forEach(el => filenameChecker.validateFilename(el, true));

  // Module validation

  moduleChecker.validateModule(rootPath, ignoreFolders, ignoreFiles);

  // single folder validations

  folders.filter(el => el.split('/').pop() === '_css')
    .forEach(singleFolderChecker.validateUnderscoreCssFolder);

  folders.filter(el => el.split('/').pop() === '_helpers')
    .forEach(singleFolderChecker.validateUnderscoreHelpersFolder);

  folders.filter(el => el.split('/').pop() === '_fonts')
    .forEach(singleFolderChecker.validateUnderscoreFontsFolder);

  folders.filter(el => el.split('/').pop() === '_media')
    .forEach(singleFolderChecker.validateUnderscoreMediaFolder);

  folders.filter(el => el.split('/').pop() === '_vendors')
    .forEach(singleFolderChecker.validateUnderscoreVendorsFolder);

  folders.filter(el => el.split('/').pop() === '_components')
    .forEach(componentChecker.validateUnderscoreComponentsFolder);

  if (options.printTreeAnalyzed) {
    console.log('FolderChecker Tree Structure Analyzed:\n');
    console.log(srcHelpers.generateAsciiTree(rootPath, files));
    console.log();
  }
};
