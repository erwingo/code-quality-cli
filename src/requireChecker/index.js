const fs = require('fs-extra');
const path = require('path');
const nodeHelpers = require('node-helpers');
const helpers = require('../folderChecker/_helpers');
const srcHelpers = require('../_helpers');

function regexGlobalWithCaptureGroups(regex, string) {
  let myArray;
  const results = [];

  while ((myArray = regex.exec(string)) !== null) {
    results.push(myArray[1]);
  }

  return results;
}

module.exports.run = (rootPath, ignoreFolders = [], ignoreFiles = [], options = {}) => {
  const jsFiles = helpers.getAllFiles(rootPath, true)
    .filter(el => nodeHelpers.file.getFileExtension(el) === 'js')
    .filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0));

  const requiredFiles = jsFiles
    .reduce((result, el) => {
      const fileContent = fs.readFileSync(el, 'utf8');

      return result.concat(
        regexGlobalWithCaptureGroups(/require\('(.+?)'/g, fileContent)
            .map(el2 => path.resolve(el, '..', el2))
            .map(el => {
              const ext = nodeHelpers.file.getFileExtension(el);

              if (ext) return el;
              return [`${el}.js`, path.resolve(el, 'index.js')];
            })
      );
    }, []);

  if (options.printTreeAnalyzed) {
    console.log('RequireChecker Tree Structure Analyzed:\n');
    console.log(srcHelpers.generateAsciiTree(rootPath, requiredFiles));
  }

  jsFiles
    .filter(el => !ignoreFiles.includes(el))
    .forEach(el => {
      if (requiredFiles.some(el2 => el2.includes(el))) return;
      throw new Error(`${el}, is not being required`);
    });
};
