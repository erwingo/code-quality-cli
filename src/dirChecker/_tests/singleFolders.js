const assert = require('assert');
const { validateUnderscoreCssFolder } = require('../../dirChecker');
const path = require('path');

describe('_css folder', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(() => {
      validateUnderscoreCssFolder(path.join(__dirname, './examples/_cssGood1'));
      validateUnderscoreCssFolder(path.join(__dirname, './examples/_cssGood2'));
    }, () => null);
  });

  it('should throw beacuse of a js file inside', () => {
    assert.throws(
      () => validateUnderscoreCssFolder(path.join(__dirname, './examples/_cssBad1')),
      err => err.message.includes('_tests/examples/_cssBad1/styles.js, only css/scss files')
    );
  });

  it('should throw because of an empty folder', () => {
    assert.throws(
      () => validateUnderscoreCssFolder(path.join(__dirname, './examples/_cssBad2')),
      err => err.message
        .includes('_tests/examples/_cssBad2/header/subheader no empty/underscore folders')
    );
  });
});
