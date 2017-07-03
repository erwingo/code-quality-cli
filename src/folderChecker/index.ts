import * as fs from 'fs-extra';
import * as helpers from './_helpers.js';
import * as componentChecker from './component';
import * as filenameChecker from './filename';
import * as moduleChecker from './module';
import * as singleFolderChecker from './singleFolder';

export function run(rootPath: string,
                    ignoreFolders: string[] = [],
                    ignoreFiles: string[] = []) {
  if (!fs.pathExistsSync(rootPath)) {
    throw new Error(`${rootPath}, does not exist`);
  }
  if (!fs.statSync(rootPath).isDirectory()) {
    throw new Error(`${rootPath}, should be a directory`);
  }

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
};
