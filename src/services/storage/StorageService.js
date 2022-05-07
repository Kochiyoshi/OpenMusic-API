const fs = require('fs');
const FileSizeError = require('../../exceptions/FileSizeError');

class StorageService {
  constructor(folder) {
    this.folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this.folder}/${filename}`;

    // eslint-disable-next-line no-underscore-dangle
    if (Buffer.byteLength(file._data) > 512000) { // if file size > 512000 bytes throw error
      throw new FileSizeError('Max upload file 512000 bytes');
    }

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
