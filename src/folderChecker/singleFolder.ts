const helpers = require('./_helpers');

interface FilesFolders {
  files: string[];
  folders: string[];
}

module.exports.validateUnderscoreCssFolder = (folderPath: string) => {
  const { files, folders }: FilesFolders = helpers.getAllFilesAndFolders(folderPath, true);

  if (files.length === 0) {
    throw new Error(`${folderPath}, should have files`);
  }

  helpers.validateFolders(folders);

  files.forEach(el => {
    if (!/\.(css|scss)$/.test(el)) {
      throw new Error(`${el}, only css/scss files`);
    }
  });
};

module.exports.validateUnderscoreFontsFolder = (folderPath: string) => {
  const { folders }: FilesFolders = helpers.getAllFilesAndFolders(folderPath, true);

  helpers.validateFolders(folders, { mustContainFoldersOrFilesNotBoth: true });
  helpers.validateFolders([folderPath], { onlyFolders: true });

  folders.forEach(el => {
    const filesAndFolders: { files: string[], folders: string[] } =
      helpers.getAllFilesAndFolders(el);

    const folders = filesAndFolders.folders;
    const files = filesAndFolders.files.map(el => el.split('/').pop());

    if (files.length === 0 && folders.length > 0) { return; }
    helpers.validateFolders(folders, { mustContainFoldersOrFilesNotBoth: true });

    if (files.includes('index.scss')) {
      const hasGoodFontFiles = files
        .filter(el => el !== 'index.scss')
        .every(el => /\.woff$/.test(el || ''));

      if (hasGoodFontFiles) { return; }
      throw new Error(`${el}, should only contain woff files`);
    } else if (files.includes('index.json')) {
      const hasGoodFontFiles = files
        .filter(el => el !== 'index.json')
        .every(el => /\.svg$/.test(el || ''));

      if (hasGoodFontFiles) { return; }
      throw new Error(`${el}, should only contain svg files`);
    } else {
      throw new Error(`${el}, should include a index.(json|scss) file`);
    }
  });
};

module.exports.validateUnderscoreMediaFolder = (folderPath: string) => {
  const { files, folders }: FilesFolders = helpers.getAllFilesAndFolders(folderPath, true);

  helpers.validateFolders([folderPath]);
  helpers.validateFolders(folders);

  files.map(el => el.split('/').pop()).forEach(el => {
    if (!/\.(jpg|png|mp4)$/.test(el || '')) { throw new Error(`${el}, invalid file`); }
  });
};

module.exports.validateUnderscoreHelpersFolder = (folderPath: string) => {
  const { files, folders }: FilesFolders = helpers.getAllFilesAndFolders(folderPath, true);

  helpers.validateFolders([folderPath], { canContainUnderscoreFolders: true });
  helpers.validateFolders(folders, { canContainUnderscoreFolders: true });

  // Check all files are js
  files.map(el => el.split('/').pop()).forEach(el => {
    if (!/\.js$/.test(el || '')) { throw new Error(`${el}, invalid file`); }
  });

  // Check folders can only contain _helpers but only if other files at same level
  folders.concat([folderPath]).forEach(el => {
    const name = el.split('/').pop();
    if (name && el !== folderPath && name[0] === '_' && name !== '_helpers') {
      throw new Error(`${el}, only _ folders allowed are _helpers`);
    }

    const filesAndFolders: FilesFolders = helpers.getAllFilesAndFolders(el);
    const files = filesAndFolders.files;
    const folders = filesAndFolders.folders.map(el => el.split('/').pop());

    if (folders.includes('_helpers')) {
      if ((files.length === 0 && folders.length <= 2) ||
          (files.length === 1 && folders.length === 1)) {
        throw new Error(`${el}, _helpers folder must not be here`);
      }
    }
  });
};

module.exports.validateUnderscoreVendorsFolder = (folderPath: string) => {
  const { folders }: FilesFolders = helpers.getAllFilesAndFolders(folderPath, true);
  helpers.validateFolders([folderPath], { onlyFolders: true });
  helpers.validateFolders(folders);
};
