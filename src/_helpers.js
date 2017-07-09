const path = require('path');

module.exports.generateJsonTree = (rootPath, files) => {
  if (!rootPath) {
    throw new Error('rootPath must be a string');
  }

  files = [...files];
  files.sort();

  const rootPathName = path.basename(rootPath);

  return files
    .map(el => path.relative(rootPath, el))
    .reduce((result, el) => {
      const parentDir = path.dirname(el);
      const filename = path.basename(el);
      const parentDirDirs = [rootPathName, ...(parentDir === '.' ? [] : parentDir.split('/'))];

      const childrenGenerator = (els, siblings = []) => {
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
            children: childrenGenerator(els.slice(1), newSiblings)
          }
        ];
      };

      return childrenGenerator(parentDirDirs, result);
    }, [])[0];
};

module.exports.generateAsciiTree = (rootPath, files) => {
  const jsonTree = module.exports.generateJsonTree(rootPath, files);

  const childrenTree = (children, levels = 0, continuationPipeLevels = []) => {
    if (children.length === 0) { return ''; }

    let separator = '├──';
    if (children.length === 1) { separator = '└──'; }

    let levelsSpaces = '';
    if (levels > 0) {
      for (let i = 0; i < levels * 4; i += 1) levelsSpaces += ' ';

      continuationPipeLevels.forEach(level => {
        const idx = (level * 4);
        levelsSpaces = levelsSpaces.substring(0, idx) + '│' + levelsSpaces.substring(idx + 1);
      });
    }

    const name = children[0].name;
    const childrensChildren = children[0].children || [];

    const childrensChildrenTree = childrenTree(
      childrensChildren,
      levels + 1,
      [
        ...continuationPipeLevels,
        ...((children.length > 1 && childrensChildren.length) ? [levels] : [])
      ]
    );

    return (
      `\n${levelsSpaces}${separator} ${name}` +
      `${childrensChildrenTree}` +
      `${childrenTree(children.slice(1), levels, continuationPipeLevels)}`
    );
  };

  if (!jsonTree) { return null; }

  return `${jsonTree.name}${childrenTree(jsonTree.children)}`;
};
