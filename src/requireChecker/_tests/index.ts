import * as assert from 'assert';
import * as path from 'path';
const requireChecker = require('../index');

describe('requireChecker', () => {
  it('should pass all validations', () => {
    assert.doesNotThrow(
      () => {
        const ignoreFiles = [path.join(__dirname, 'examples/projectGood1/index.js')];
        requireChecker.run(path.join(__dirname, 'examples/projectGood1'), [], ignoreFiles);
      }
    );
  });

  it('should throw because a js file is not being required anywhere', () => {
    assert.throws(
      () =>
        requireChecker.run(path.join(__dirname, 'examples/projectBad1')),
      err => err.message.includes('projectBad1/index.js, is not being required')
    );

    const ignoreFiles = [path.resolve(__dirname, 'examples/projectBad2/index.js')];

    assert.throws(
      () =>
        requireChecker.run(path.join(__dirname, 'examples/projectBad2'), [], ignoreFiles),
      err => err.message.includes('projectBad2/src/landingpages/awesomething.js, is not being required')
    );
  });
});
