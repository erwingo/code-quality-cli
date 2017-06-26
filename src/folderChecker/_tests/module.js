const assert = require('assert');
const path = require('path');
const { validateModule } = require('../module');

describe.only('Module', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      validateModule(path.join(__dirname, 'examples/ModuleGood1'));
      validateModule(path.join(__dirname, 'examples/ModuleGood2'));
      validateModule(path.join(__dirname, 'examples/ModuleGood3'));
      validateModule(path.join(__dirname, 'examples/ModuleGood4'));
    }, err => null);
  });

  it('cannot be empty', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad1')),
      err => err.message.includes('ModuleBad1, cannot be empty')
    );
  });

  it(`should only have allowed _ folders (_tests, _css, _components,
      _media, _vendors, _fonts)`, () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad2')),
      err => err.message.includes('_lul, invalid _ folder')
    );
  });

  it('cannot have module folders with _ files', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad3')),
      err => err.message.includes('ModuleBad3, cannot contain _ file(s)')
    );

    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad3a')),
      err => err.message.includes('ModuleBad3a/Dashboard, cannot contain _ file(s)')
    );
  });

  it('cannot have module folders with non js files', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad4')),
      err => err.message.includes('ModuleBad4/lul.css, invalid file extension')
    );
  });

  it('cannot have module folders with capitalized names in js files', () => {
    assert.throws(
      () =>
        validateModule(path.join(__dirname, 'examples/ModuleBad5')),
      err =>
        err.message.includes('ModuleBad5/Dashboard/An.js, cannot have capitalized name')
    );
  });
});
