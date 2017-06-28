const assert = require('assert');
const path = require('path');
const { validateUnderscoreComponentsFolder } = require('../component');

describe('_components', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood1'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood2'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood3'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood4'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood5'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood6'));
      validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood7'));
    });
  });

  it('should throw because empty folder', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad1')),
      err => err.message.includes('_componentsBad1, cannot be empty')
    );
  });

  it('should throw because wrong file type', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad1a')),
      err => err.message.includes('_componentsBad1a/lol.scss, invalid file')
    );
  });

  it('should throw because component names should not be capitalized', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad2')),
      err =>
        err.message.includes('_componentsBad2/Sidebar, component name should not be capitalized')
    );
  });

  it('should throw because component folder must have an index.js', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad3')),
      err => err.message
        .includes('_componentsBad3/_components/footer, component must include index.js')
    );
  });

  it('should throw because component can only contain _ folders', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad4')),
      err => err.message
        .includes('_componentsBad4/sidebar/_components/footer, ' +
          'component can only contain _ folders')
    );
  });

  it('should throw because it contains both folder and file _helpers', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad5')),
      err => err.message
        .includes('_componentsBad5/sidebar, cannot have both file and folder _helpers')
    );
  });

  it('should throw because it contains both folder and file _tests', () => {
    assert.throws(
      () =>
        validateUnderscoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad6')),
      err => err.message
        .includes('_componentsBad6/sidebar, cannot have both file and folder _tests')
    );
  });
});
