const path = require('path');
const assert = require('assert');
const folderChecker = require('../../folderChecker/singleFolder');

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

describe('_fonts folders', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsGood1'));
      folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsGood2'));
    });
  });

  it('should only contain woff files if index.scss', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad1')),
      err => err.message.includes('/_fontsBad1/gotham, should only contain woff files')
    );
  });

  it('should only contain svg files if index.json', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad1a')),
      err => err.message.includes('/_fontsBad1a/gotham, should only contain svg files')
    );
  });

  it('should include a index.(json|scss) file', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad2')),
      err => err.message
        .includes('/_fontsBad2/google/comicsans, should include a index.(json|scss) file')
    );
  });

  it('should only contain folders or files not both at the same time', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad3')),
      err => err.message.includes('/_fontsBad3/google, cannot contain both files and folders')
    );
  });

  it('root folder should not be empty', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad4')),
      err => err.message.includes('/_fontsBad4, must only contain folders')
    );
  });

  it('root folder should contain only folders', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreFontsFolder(path.join(__dirname, 'examples/_fontsBad5')),
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

describe('_helpers folder', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersGood1'));
      folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersGood2'));
      folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersGood3'));
      folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersGood4'));
    });
  });

  it('root folder should not be empty', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad1')),
      err => err.message.includes('/_helpersBad1, cannot be empty')
    );
  });

  it('_helpers subfolder cannot be empty', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad2')),
      err => err.message.includes('/_helpersBad2/_helpers, cannot be empty')
    );
  });

  it('should not contain folders that only have _helpers folder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad3')),
      err => err.message.includes('/_helpersBad3/special, _helpers folder must not be here')
    );
  });

  it('only _ folders allowed are _helpers', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad4')),
      err => err.message.includes('/_helpersBad4/special/_helperss, only _ folders allowed are _helpers')
    );
  });

  it('_helpers folder should not be with only 1 sibling folder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad5')),
      err => err.message.includes('/_helpersBad5, _helpers folder must not be here')
    );
  });

  it('_helpers folder should not be with only 1 sibling file', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad5a')),
      err => err.message.includes('/_helpersBad5a, _helpers folder must not be here')
    );
  });

  it('can only contain js files', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreHelpersFolder(path.join(__dirname, 'examples/_helpersBad6')),
      err => err.message.includes('lol.jpg, invalid file')
    );
  });
});

describe('_vendors folders', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsGood1'));
      folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsGood2'));
      folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsGood3'));
    });
  });

  it('should throw because empty folder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsBad1')),
      err => err.message.includes('_vendorsBad1, must only contain folders')
    );
  });

  it('should throw because empty subdolder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsBad2')),
      err => err.message.includes('_vendorsBad2/d3, cannot be empty')
    );
  });

  it('should throw because empty deep subdolder', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsBad3')),
      err => err.message.includes('_vendorsBad3/d3/utils/items, cannot be empty')
    );
  });

  it('should throw because cannot contain _ folders', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsBad4')),
      err => err.message.includes('_vendorsBad4, cannot contain _ folder(s)')
    );
  });

  it('should throw because cannot contain _ subfolders', () => {
    assert.throws(
      () =>
        folderChecker.validateUnderscoreVendorsFolder(path.join(__dirname, 'examples/_vendorsBad5')),
      err => err.message.includes('_vendorsBad5/d3, cannot contain _ folder(s)')
    );
  });
});
