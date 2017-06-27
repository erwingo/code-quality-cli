#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const glob = require('glob');
const helpers = require('./_helpers');
const filenameChecker = require('./folderChecker/filename');
const componentChecker = require('./folderChecker/component');
const moduleChecker = require('./folderChecker/module');
const singleFolderChecker = require('./folderChecker/singleFolder');
const version = require('../package.json').version;

commander.version(version)
  .usage('[options] <path>')
  .option(
    '-d, --ignore-folders <folders>',
    'folders to ommit, should be a string, it accepts glob patterns'
  )
  .option(
    '-f, --ignore-files <files>',
    'files to ommit, should be a string, it accepts glob patterns'
  )
  .option(
    '-c, --config-file <path>',
    'path to the config json file, (defaults to ./code-quality)'
  )
  .parse(process.argv);

if (commander.args.length !== 1) {
  commander.help();
} else {
  try {
    const rootPath = path.resolve(commander.args[0]);

    if (!fs.statSync(rootPath).isDirectory()) throw new Error(`${rootPath}, should be a directory`);

    let configFilePath;
    let ignoreFoldersGlobPattern;
    let ignoreFilesGlobPattern;

    try {
      if (commander.configFile) configFilePath = path.resolve(commander.configFile);
      else configFilePath = path.resolve(rootPath, './.code-quality.json');

      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

      if (config.ignoreFolders && config.ignoreFolders.length > 0) {
        ignoreFoldersGlobPattern = `{${config.ignoreFolders.join(',')}}`;
      }

      if (config.ignoreFiles && config.ignoreFiles.length > 0) {
        ignoreFilesGlobPattern = `{${config.ignoreFiles.join(',')}}`;
      }
    } catch (error) {
      ignoreFoldersGlobPattern = commander.ignoreFolders;
      ignoreFilesGlobPattern = commander.ignoreFiles;
    }

    let { files, folders } = helpers.getAllFilesAndFolders(rootPath, true);
    let ignoreFolders = [];
    let ignoreFiles = [];

    // Ignore the code-quality.json or config json passed on by default
    files = files.filter(el => el !== configFilePath);

    if (ignoreFoldersGlobPattern) {
      ignoreFolders = glob.sync(ignoreFoldersGlobPattern).map(el => path.resolve(el));
      files = files.filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0));
      folders = folders.filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0));
    }

    if (ignoreFilesGlobPattern) {
      ignoreFiles = glob.sync(ignoreFilesGlobPattern).map(el => path.resolve(el));
      files = files.filter(el => !ignoreFiles.some(el2 => el.indexOf(el2) === 0));
    }

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
  } catch (err) {
    console.error('\n', err.message, '\n\n');
    throw err;
  }
}
