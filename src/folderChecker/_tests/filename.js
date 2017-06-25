const assert = require('assert');
const helpers = require('../_helpers');
const { validateFilename } = require('../../folderChecker/filename');

describe('filenames/folders', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(
      () => {
        ['erwin.js', '_erwin.js', 'erwingo.css', 'erwin1.scss'].forEach(validateFilename);
        ['erwinGaitan.jpg', 'erwin-gaitan.png', 'erwin_gaitan.mp4'].forEach(validateFilename);
        ['lol.woff', 'omg4.svg', 'whatisthis4.json'].forEach(validateFilename);

        const { files, folders } = helpers.getAllFilesAndFolders(__dirname, 'examples', true);
        files.map(el => el.split('/').pop()).forEach(validateFilename);
        folders.map(el => el.split('/').pop()).forEach(el => validateFilename(el, true));
      }
    );
  });

  it('should throw because extension is not .(js|css|scss|jpg|png|mp4|woff|svg|json)', () => {
    assert.throws(
      () => { validateFilename('erwin.jss'); },
      err => err.message.includes('erwin.jss, invalid extension')
    );

    assert.throws(
      () => { validateFilename('erwin.sass'); },
      err => err.message.includes('erwin.sass, invalid extension')
    );
  });

  it('should throw because name contains non allowed character', () => {
    assert.throws(
      () => { validateFilename('erwi~n.mp4'); },
      err => err.message.includes('erwi~n.mp4, contains invalid character')
    );

    assert.throws(
      () => { validateFilename('erwi/n.mp4'); },
      err => err.message.includes('erwi/n.mp4, contains invalid character')
    );

    assert.throws(
      () => { validateFilename('erwin gaitan.json'); },
      err => err.message.includes('erwin gaitan.json, contains invalid character')
    );
  });

  it('should throw because name does not start with _ or letter', () => {
    assert.throws(
      () => { validateFilename('$erwin.js'); },
      err => err.message.includes('$erwin.js, does not start with _ or letter')
    );

    assert.throws(
      () => { validateFilename(' erwin.js'); },
      err => err.message.includes(' erwin.js, does not start with _ or letter')
    );

    assert.throws(
      () => { validateFilename('-erwin.js'); },
      err => err.message.includes('-erwin.js, does not start with _ or letter')
    );
  });

  it('should throw because name (no extension incl.) doesnt finish with letter/number', () => {
    assert.throws(
      () => { validateFilename('erwin-.js'); },
      err => err.message.includes('erwin-.js, does not finish with letter/number')
    );

    assert.throws(
      () => { validateFilename('erwinOmg$.js'); },
      err => err.message.includes('erwinOmg$.js, does not finish with letter/number')
    );
  });
});
