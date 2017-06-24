const assert = require('assert');
const folderChecker = require('../../folderChecker');
const path = require('path');

describe('_css folder', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssGood1'));
      folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssGood2'));
    });
  });

  it('should throw because of a non css/scss file inside', () => {
    assert.throws(
      () => folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssBad1')),
      err => err.message.includes('_cssBad1/styles.js, only css/scss files')
    );
  });

  it('should throw because of an empty subfolder', () => {
    assert.throws(
      () => folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssBad2')),
      err => err.message.includes('_cssBad2/header/subheader, cannot be empty')
    );
  });

  it('should throw because it should have files', () => {
    assert.throws(
      () => folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssBad3')),
      err => err.message.includes('/_cssBad3, should have files')
    );
  });

  it('should throw because it should not have _ folders', () => {
    assert.throws(
      () => folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssBad4')),
      err => err.message.includes('/_cssBad4/items, cannot contain _ folder(s)')
    );
  });

  it('should throw because it should not have _ files', () => {
    assert.throws(
      () => folderChecker.validateUnderscoreCssFolder(path.join(__dirname, 'examples/_cssBad5')),
      err => err.message.includes('/_cssBad5/items, cannot contain _ file(s)')
    );
  });
});

describe('_font folder', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsGood1'));
      folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsGood2'));
    });
  });

  it('should only contain woff files if index.scss', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad1')),
      err => err.message.includes('/_fontsBad1/gotham, should only contain woff files')
    );
  });

  it('should only contain svg files if index.json', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad1a')),
      err => err.message.includes('/_fontsBad1a/gotham, should only contain svg files')
    );
  });

  it('should include a index.(json|scss) file', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad2')),
      err => err.message
        .includes('/_fontsBad2/google/comicsans, should include a index.(json|scss) file')
    );
  });

  it('should only contain folders or files not both at the same time', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad3')),
      err => err.message.includes('/_fontsBad3/google, cannot contain both files and folders')
    );
  });

  it('must contain at least 1 font folder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad4')),
      err => err.message.includes('/_fontsBad4, must contain at least 1 font folder')
    );
  });
});
