const fs = require('fs').promises;
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyFolderPath, { recursive: true }) 
  .then(() => {
    return fs.readdir(folderPath);
  })
  .then((files) => {
    const copiedFilesPromise = fs.readdir(copyFolderPath);
    return Promise.all([files, copiedFilesPromise]);
  })
  .then(([files, copiedFiles]) => {
    const copyPromises = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      return fs.copyFile(filePath, copyFilePath);
    });
    return Promise.all(copyPromises)
    .then(() => {
      const filesDelete = copiedFiles.filter((file) => !files.includes(file));
      const deletePromises = filesDelete.map((file) => {
        const fileDeletePath = path.join(copyFolderPath, file);
        return fs.unlink(fileDeletePath);
      })
      return Promise.all(deletePromises);
    });
  })