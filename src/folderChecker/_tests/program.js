const path = require('path');
const assert = require('assert');
const program = require('../index');

describe('Program', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      const ignoreFolders = [
        path.resolve(__dirname, 'examples/project/node_modules'),
        path.resolve(__dirname, 'examples/project/coverage'),
        path.resolve(__dirname, 'examples/project/.nyc_output'),
        path.resolve(__dirname, 'examples/project/.git')
      ];

      const ignoreFiles = [
        path.resolve(__dirname, 'examples/project/.gitignore')
      ];

      program.run(path.join(__dirname, 'examples/project'), ignoreFolders, ignoreFiles);
    });
  });

  it('should throw because of no directory', () => {
    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project/.gitignore')),
      err => err.message.includes('project/.gitignore, should be a directory')
    );
  });

  it('should throw because of directory does not exist', () => {
    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/doesnotexist')),
      err => err.message.includes('doesnotexist, does not exist')
    );
  });

  it('should throw because of .gitignore file', () => {
    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project')),
      err => err.message.includes('.gitignore, invalid extension')
    );
  });

  it('should throw because of coverage module', () => {
    const ignoreFiles = [
      path.resolve(__dirname, 'examples/project/.gitignore')
    ];

    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project'), [], ignoreFiles),
      err => err.message.includes('coverage/_tests.js.html, contains invalid characters')
    );
  });

  it('should throw because of node_modules', () => {
    const ignoreFolders = [
      path.resolve(__dirname, 'examples/project/coverage')
    ];

    const ignoreFiles = [
      path.resolve(__dirname, 'examples/project/.gitignore')
    ];

    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project'), ignoreFolders, ignoreFiles),
      err => err.message.includes('node_modules/fsextra/lul bad.js, contains invalid characters')
    );
  });

  it('should throw because of .git folder', () => {
    const ignoreFolders = [
      path.resolve(__dirname, 'examples/project/coverage'),
      path.resolve(__dirname, 'examples/project/node_modules')
    ];

    const ignoreFiles = [
      path.resolve(__dirname, 'examples/project/.gitignore')
    ];

    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project'), ignoreFolders, ignoreFiles),
      err => err.message.includes('.git, does not start with _ or letter')
    );
  });

  it('should throw because of .nyc_output folder', () => {
    const ignoreFolders = [
      path.resolve(__dirname, 'examples/project/coverage'),
      path.resolve(__dirname, 'examples/project/node_modules'),
      path.resolve(__dirname, 'examples/project/.git')
    ];

    const ignoreFiles = [
      path.resolve(__dirname, 'examples/project/.gitignore')
    ];

    assert.throws(
      () =>
        program.run(path.join(__dirname, 'examples/project'), ignoreFolders, ignoreFiles),
      err => err.message.includes('.nyc_output, does not start with _ or letter')
    );
  });
});
