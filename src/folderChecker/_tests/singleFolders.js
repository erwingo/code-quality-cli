const assert = require('assert');
const folderChecker = require('../../folderChecker');
const path = require('path');

describe('_css folders', () => {
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

describe('_font folders', () => {
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

  it('root folder should not be empty', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad4')),
      err => err.message.includes('/_fontsBad4, must only contain folders')
    );
  });

  it('root folder should contain only folders', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontFolder(path.join(__dirname, 'examples/_fontsBad5')),
      err => err.message.includes('/_fontsBad5, must only contain folders')
    );
  });
});

describe('_media folders', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaGood1'));
      folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaGood2'));
      folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaGood3'));
    });
  });

  it('should not contain an empty root folder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaBad1')),
      err => err.message.includes('/_mediaBad1, cannot be empty')
    );
  });

  it('should contain valid files', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaBad2')),
      err => err.message.includes('image.js, invalid file')
    );
  });

  it('should not contain empty folders', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreMediaFolder(path.join(__dirname, 'examples/_mediaBad3')),
      err => err.message.includes('_mediaBad3/bgs, cannot be empty')
    );
  });
});
