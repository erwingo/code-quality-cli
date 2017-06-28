#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const glob = require('glob');
const version = require('../package.json').version;
const folderChecker = require('./folderChecker');

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

    // try reading config file if any
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

    let ignoreFolders = [];
    let ignoreFiles = [];

    if (ignoreFoldersGlobPattern) {
      ignoreFolders = glob.sync(ignoreFoldersGlobPattern).map(el => path.resolve(el));
    }

    if (ignoreFilesGlobPattern) {
      ignoreFiles = glob.sync(ignoreFilesGlobPattern).map(el => path.resolve(el));
    }

    ignoreFiles.push(configFilePath);

    folderChecker.run(rootPath, ignoreFolders, ignoreFiles);
  } catch (err) {
    console.error('\n', err.message, '\n\n');
    throw err;
  }
}
