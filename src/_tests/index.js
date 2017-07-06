const assert = require('assert');
const helpers = require('../_helpers');

describe.only('src helpers', () => {
  describe('generateTree()', () => {
    it('should generate correct output for no files', () => {
      const actual = helpers.generateJsonTree('lul', []);
      const expected = undefined;
      assert.equal(actual, expected);
    });

    it('should generate correct output for 0 level deep', () => {
      const actual = helpers.generateJsonTree(
        'lul',
        ['./lul/package.json', './lul/anotherthing.js']
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          { name: 'package.json', path: 'lul/package.json' },
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = helpers.generateJsonTree(
        'lul',
        ['lul/package.json', 'lul/anotherthing.js', 'lul/omg/index.js']
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          { name: 'package.json', path: 'lul/package.json' },
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' },
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              { name: 'index.js', path: 'lul/omg/index.js' }
            ]
          }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = helpers.generateJsonTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/omg/what/thefuck.jpg',
          'lul/omg/what/thefuck2.jpg',
          'lul/omg/index.js'
        ]
      );

      const expected = {
        name: 'lul',
        path: 'lul',
        children: [
          { name: 'package.json', path: 'lul/package.json' },
          {
            name: 'src',
            path: 'lul/src',
            children: [
              {
                name: 'hehe',
                path: 'lul/src/hehe',
                children: [
                  { name: 'wut.js', path: 'lul/src/hehe/wut.js' }
                ]
              }
            ]
          },
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              {
                name: 'what',
                path: 'lul/omg/what',
                children: [
                  { name: 'thefuck.jpg', path: 'lul/omg/what/thefuck.jpg' },
                  { name: 'thefuck2.jpg', path: 'lul/omg/what/thefuck2.jpg' }
                ]
              },
              { name: 'index.js', path: 'lul/omg/index.js' }
            ]
          }
        ]
      };

      assert.deepStrictEqual(actual, expected);
    });

    it('should throw if not path is passed', () => {
      assert.throws(
        () => {
          helpers.generateJsonTree();
        },
        err => err.message.includes('rootPath must be a string')
      );
    });
  });
});
