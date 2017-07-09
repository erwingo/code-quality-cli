const assert = require('assert');
const helpers = require('../_helpers');

describe('src helpers', () => {
  describe('generateJsonTree()', () => {
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
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' },
          { name: 'package.json', path: 'lul/package.json' }
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
          { name: 'anotherthing.js', path: 'lul/anotherthing.js' },
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              { name: 'index.js', path: 'lul/omg/index.js' }
            ]
          },
          { name: 'package.json', path: 'lul/package.json' }
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
          {
            name: 'omg',
            path: 'lul/omg',
            children: [
              { name: 'index.js', path: 'lul/omg/index.js' },
              {
                name: 'what',
                path: 'lul/omg/what',
                children: [
                  { name: 'thefuck.jpg', path: 'lul/omg/what/thefuck.jpg' },
                  { name: 'thefuck2.jpg', path: 'lul/omg/what/thefuck2.jpg' }
                ]
              }
            ]
          },
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

  describe('generateAsciiTree()', () => {
    it('should return correct output for no files', () => {
      const actual = helpers.generateAsciiTree('lul', []);
      const expected = null;
      assert.equal(actual, expected);
    });

    it('should generate correct output for 0 levels', () => {
      const actual = helpers.generateAsciiTree(
        'lul',
        ['./lul/package.json', './lul/anotherthing.js']
      );

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '└── package.json';

      assert.equal(actual, expected);
    });

    it('should generate correct output for 1 level deep', () => {
      const actual = helpers.generateAsciiTree(
        'lul',
        ['lul/package.json', 'lul/anotherthing.js', 'lul/omg/index.js']
      );

      const expected =
        'lul\n' +
        '├── anotherthing.js\n' +
        '├── omg\n' +
        '│   └── index.js\n' +
        '└── package.json';

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 2 level deep', () => {
      const actual = helpers.generateAsciiTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/omg/what/thefuck.jpg',
          'lul/omg/what/thefuck2.jpg',
          'lul/omg/index.js'
        ]
      );

      const expected =
        'lul\n' +
        '├── omg\n' +
        '│   ├── index.js\n' +
        '│   └── what\n' +
        '│       ├── thefuck.jpg\n' +
        '│       └── thefuck2.jpg\n' +
        '├── package.json\n' +
        '└── src\n' +
        '    └── hehe\n' +
        '        └── wut.js';

      assert.deepStrictEqual(actual, expected);
    });

    it('should generate correct output for 3 level deep', () => {
      const actual = helpers.generateAsciiTree(
        'lul',
        [
          'lul/package.json',
          'lul/src/hehe/wut.js',
          'lul/win/ammm/cas.jpg',
          'lul/win/ammm/level3/1.js',
          'lul/win/ammm/level3/2.js',
          'lul/win/ammm/thefuck3.js',
          'lul/win/index.js',
          'lul/zzz/index.js'
        ]
      );

      const expected =
        'lul\n' +
        '├── package.json\n' +
        '├── src\n' +
        '│   └── hehe\n' +
        '│       └── wut.js\n' +
        '├── win\n' +
        '│   ├── ammm\n' +
        '│   │   ├── cas.jpg\n' +
        '│   │   ├── level3\n' +
        '│   │   │   ├── 1.js\n' +
        '│   │   │   └── 2.js\n' +
        '│   │   └── thefuck3.js\n' +
        '│   └── index.js\n' +
        '└── zzz\n' +
        '    └── index.js';

      assert.deepStrictEqual(actual, expected);
    });
  });
});
