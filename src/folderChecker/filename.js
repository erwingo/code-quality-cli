const nodeHelpers = require('node-helpers');

module.exports.validateFilename = (filePath, isFolder = false) => {
  const basename = nodeHelpers.file.getFileBasename(filePath);
  const extension = nodeHelpers.file.getFileExtension(filePath);

  if (!isFolder && !/^(js|css|scss|jpg|png|mp4|woff|svg|json)$/.test(extension)) {
    throw new Error(`${filePath}, invalid extension`);
  }

  if (basename[0] !== '_' && !/^[a-zA-Z]/.test(basename)) {
    throw new Error(`${filePath}, does not start with _ or letter`);
  }

  if (!/[a-zA-Z0-9]$/.test(basename)) {
    throw new Error(`${filePath}, does not finish with letter/number`);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(basename)) {
    throw new Error(`${filePath}, contains invalid characters`);
  }
};
