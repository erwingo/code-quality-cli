const assert = require('assert');
const path = require('path');
const { validateModule } = require('../module');

describe('Module', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      validateModule(path.join(__dirname, 'examples/moduleGood1'));
      validateModule(path.join(__dirname, 'examples/moduleGood2'));
      validateModule(path.join(__dirname, 'examples/moduleGood3'));
      validateModule(path.join(__dirname, 'examples/moduleGood4'));
      validateModule(path.join(__dirname, 'examples/moduleGood5'));
    });
  });

  it('cannot be empty', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad1')),
      err => err.message.includes('moduleBad1, cannot be empty')
    );
  });

  it(`should only have allowed _ folders
      (_tests, _css, _helpers, _components, _media, _vendors, _fonts)`, () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad2')),
      err => err.message.includes('_lul, invalid _ folder')
    );
  });

  it('cannot have modules with _ files', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad3')),
      err => err.message.includes('moduleBad3/_awesomething.js, invalid _ file')
    );

    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad3a')),
      err => err.message.includes('moduleBad3a/dashboard/_awesomething.js, invalid _ file')
    );
  });

  it('cannot have modules with non js files', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad4')),
      err => err.message.includes('moduleBad4/lul.css, invalid file extension')
    );
  });

  it('cannot have modules with capitalized names', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad5')),
      err =>
        err.message.includes('moduleBad5/dashboard/BannerArea, cannot have capitalized name')
    );
  });

  it('cannot have modules with both file and folder _helpers', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad6')),
      err =>
        err.message.includes('moduleBad6/dashboard, cannot have both file and folder _helpers')
    );
  });

  it('cannot have modules with both file and folder _tests', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/moduleBad7')),
      err =>
        err.message.includes('moduleBad7/dashboard, cannot have both file and folder _tests')
    );
  });
});
