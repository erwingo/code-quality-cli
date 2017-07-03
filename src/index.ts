#! /usr/bin/env node

import * as commander from 'commander';
import * as fs from 'fs';
// import * as glob from 'glob';
const glob = require('glob');
// import * as _ from 'lodash';
const _ = require('lodash');
import * as path from 'path';
import * as folderChecker from './folderChecker';
import * as requireChecker from './requireChecker';

interface ProgramOptions {
  configFile?: string;
  ignoreFolders?: string;
  ignoreFiles?: string;
}

// TODO: this is a vital function and has to work!
let lol: string = 'omg' + 4;
lol = 'erwerwer';

const version = require('../package.json').version;

function getCorrectRootPath(initialRootPath: string) {
  const rootPath = path.resolve(initialRootPath);

  if (!fs.statSync(rootPath).isDirectory()) {
    throw new Error(`${rootPath}, should be a directory`);
  }

  return rootPath;
}

function getIgnoreFilesFolders(rootPath: string,
                               namespace: string,
                               options: ProgramOptions = {}) {
  let config;
  let ignoreFoldersGlobPattern;
  let ignoreFilesGlobPattern;

  const configFilePath = options.configFile ?
    path.resolve(options.configFile) : path.resolve(rootPath, './.codequality.json');

  try {
    config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  } catch (err) {
    config = undefined;
  }

  if (config) {
    // _.at returns an array of matches so i pull the first one
    const ignoreFolders = _.at(config, `${namespace}.ignoreFolders`)[0];

    if (ignoreFolders) {
      ignoreFolders.push(ignoreFolders[0]);
      ignoreFoldersGlobPattern = `{${ignoreFolders.join(',')}}`;
    } else {
      ignoreFoldersGlobPattern = options.ignoreFolders;
    }

    const ignoreFiles = _.at(config, `${namespace}.ignoreFiles`)[0];

    if (ignoreFiles) {
      // this won't work {./src/index.js} but this does {./src/index.js,./src/index.js}
      // so i make sure there are at least 2 items in array even if they are equal
      // it wont matter
      ignoreFiles.push(ignoreFiles[0]);

      ignoreFilesGlobPattern = `{${ignoreFiles.join(',')}}`;
    } else {
      ignoreFilesGlobPattern = options.ignoreFiles;
    }
  }

  const ignoreFolders: string[] = [];
  const ignoreFiles: string[] = [configFilePath];

  if (ignoreFoldersGlobPattern) {
    ignoreFolders.push(
      ...(glob.sync(ignoreFoldersGlobPattern, { cwd: rootPath }) as string[])
              .map(el => path.resolve(el))
    );
  }

  if (ignoreFilesGlobPattern) {
    ignoreFiles.push(
      ...(glob.sync(ignoreFilesGlobPattern, { cwd: rootPath }) as string[])
              .map(el => path.resolve(el))
    );
  }

  return { ignoreFolders, ignoreFiles };
}

commander
  .version(version);

commander
  .command('folderChecker <rootPath>')
  .description('Check for folder structure')
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
    'path to the config json file, (defaults to ./.codequality.json)'
  )
  .action((rootPath: string, options: ProgramOptions) => {
    try {
      const rootPath = getCorrectRootPath(commander.args[0]);

      const { ignoreFolders, ignoreFiles } =
        getIgnoreFilesFolders(rootPath, 'folderChecker', options);

      folderChecker.run(rootPath, ignoreFolders, ignoreFiles);
    } catch (err) {
      console.error('\n', err.message, '\n\n');
      throw err;
    }
  });

commander
  .command('requireChecker <rootPath>')
  .description('Check for folder structure')
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
    'path to the config json file, (defaults to ./.codequality.json)'
  )
  .action((rootPath: string, options: ProgramOptions) => {
    try {
      const rootPath = getCorrectRootPath(commander.args[0]);

      const { ignoreFolders, ignoreFiles } =
        getIgnoreFilesFolders(rootPath, 'requireChecker', options);

      requireChecker.run(rootPath, ignoreFolders, ignoreFiles);
    } catch (err) {
      console.error('\n', err.message, '\n\n');
      throw err;
    }
  });

commander
  .on('*', () => {
    commander.help();
  });

commander.parse(process.argv);
