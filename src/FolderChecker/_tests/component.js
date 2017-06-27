const assert = require('assert');
const path = require('path');
const { validateUndercoreComponentsFolder } = require('../component');

describe('_components', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood1'));
      validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood2'));
      validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood3'));
      validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood4'));
      validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsGood5'));
    });
  });

  it('should throw because empty folder', () => {
    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad1')),
      err => err.message.includes('_componentsBad1, cannot be empty')
    );
  });

  it('should throw because wrong file type', () => {
    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad1a')),
      err => err.message.includes('_componentsBad1a/Lol.scss, invalid file')
    );
  });

  it('should throw because component folders/files should be capitalized', () => {
    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad2')),
      err => err.message.includes('_componentsBad2/sidebar, should be capitalized')
    );

    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad2a')),
      err => err.message.includes('_componentsBad2a/clock.js, should be capitalized')
    );
  });

  it('should throw because _component folder should have index.js', () => {
    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad3')),
      err => err.message
        .includes('_componentsBad3/_components/Footer, must include index.js')
    );
  });

  it('should throw because folder component cannot contain file/folder component', () => {
    assert.throws(
      () =>
        validateUndercoreComponentsFolder(path.join(__dirname, 'examples/_componentsBad4')),
      err => err.message
        .includes('_componentsBad4/Sidebar/_components/Footer/Wow.js, ' +
          'cannot contain file/folder component')
    );
  });
});
