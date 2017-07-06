const path = require('path');

module.exports.generateJsonTree = (rootPath, files) => {
  if (!rootPath) {
    throw new Error('rootPath must be a string');
  }

  const rootPathName = path.basename(rootPath);

  return files
    .map(el => path.relative(rootPath, el))
    .reduce((result, el) => {
      const parentDir = path.dirname(el);
      const filename = path.basename(el);
      const parentDirDirs = [rootPathName, ...(parentDir === '.' ? [] : parentDir.split('/'))];

      const erwin = (els, siblings = []) => {
        if (els.length === 0) {
          return [...siblings, { name: filename, path: path.join(rootPathName, el) }];
        }

        const fpath = parentDirDirs.slice(0, parentDirDirs.length - (els.length - 1)).join('/');
        const item = siblings.find(el => el.path === fpath);
        const newSiblings = (item && item.children) || [];

        return [
          ...siblings.filter(el => el.path !== fpath),
          {
            name: els[0],
            path: fpath,
            children: erwin(els.slice(1), newSiblings)
          }
        ];
      };

      return erwin(parentDirDirs, result);
    }, [])[0];
};
