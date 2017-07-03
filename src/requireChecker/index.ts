import * as fs from 'fs-extra';
// import * as nodeHelpers from 'node-helpers';
const nodeHelpers = require('node-helpers');
import * as path from 'path';
import * as helpers from '../folderChecker/_helpers';

interface FilesFolders {
  files: string[];
  folders: string[];
}

function regexGlobalWithCaptureGroups(regex: RegExp, string: string): string[] {
  const results: string[] = [];
  let myArray: RegExpExecArray | null;

  while ((myArray = regex.exec(string)) !== null) {
    results.push(myArray[1]);
  }

  return results;
}

export function run(rootPath: string, ignoreFolders: string[] = [], ignoreFiles: string[] = []) {
  const jsFiles = (helpers.getAllFiles(rootPath, true) as string[])
    .filter(el => nodeHelpers.file.getFileExtension(el) === 'js')
    .filter(el => !ignoreFolders.some(el2 => el.indexOf(el2) === 0));

  const requiredFiles = jsFiles
    .reduce((result, el) => {
      const fileContent = fs.readFileSync(el, 'utf8');

      return result.concat(
        regexGlobalWithCaptureGroups(/require\('(.+?)'/g, fileContent)
          .map(el2 => path.resolve(el, '..', el2))
          .map(el => {
            const ext: string | null = nodeHelpers.file.getFileExtension(el);

            if (ext) { return el; }
            return [`${el}.js`, path.resolve(el, 'index.js')];
          })
      );
    }, ([] as (string | string[])[]));

  jsFiles
    .filter(el => !ignoreFiles.includes(el))
    .forEach(el => {
      if (requiredFiles.some(el2 => el2.includes(el))) { return; }
      throw new Error(`${el}, is not being required`);
    });
}
