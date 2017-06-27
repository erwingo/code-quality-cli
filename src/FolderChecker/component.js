const helpers = require('./_helpers');

module.exports.validateUnderscoreComponentsFolder = folderPath => {
  const folders = helpers.getAllFolders(folderPath, true);

  helpers.validateFolders([folderPath], { canContainUnderscoreFolders: true });
  helpers.validateFolders(folders, { canContainUnderscoreFolders: true });

  const underscoreComponentFolders = folders
    .filter(el => /\/_components$/.test(el))
    .concat(folderPath);

  const { componentFolders, fileComponents } = underscoreComponentFolders
    .reduce((result, el) => {
      const folders = helpers.getAllFolders(el)
        .filter(el => el.split('/').pop()[0] !== '_');

      const files = helpers.getAllFiles(el);

      files.forEach(el => {
        if (!/\.js$/.test(el)) throw new Error(`${el}, invalid file`);
      });

      return {
        componentFolders: result.componentFolders.concat(folders),
        fileComponents: result.fileComponents.concat(files)
      };
    }, { componentFolders: [], fileComponents: [] });

  componentFolders.forEach(el => {
    const { files, folders } = helpers.getAllFilesAndFolders(el);

    if (!files.map(el => el.split('/').pop()).includes('index.js')) {
      throw new Error(`${el}, must include index.js`);
    }

    files.concat(folders).forEach(el => {
      if (/[A-Z]/.test(el.split('/').pop()[0])) {
        throw new Error(`${el}, cannot contain file/folder component`);
      }
    });
  });

  componentFolders.concat(fileComponents).forEach(el => {
    if (!/[A-Z]/.test(el.split('/').pop()[0])) throw new Error(`${el}, should be capitalized`);
  });
};
