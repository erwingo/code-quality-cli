module.exports.validateFilename = filename => {
  const basename = filename.split('.')[0];
  const extension = filename.split('.').pop();

  if (!/^(js|css|scss|jpg|png|mp4|woff|svg|json)$/.test(extension)) {
    throw new Error(`${filename}, invalid extension`);
  }

  if (basename[0] !== '_' && !/^[a-zA-Z]/.test(basename)) {
    throw new Error(`${filename}, does not start with _ or letter`);
  }

  if (!/[a-zA-Z0-9]$/.test(basename)) {
    throw new Error(`${filename}, does not finish with letter/number`);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(basename)) {
    throw new Error(`${filename}, contains invalid characters`);
  }
};
