const fs = require('fs').promises;
const path = require('path');
const folderPath = path.join(__dirname, 'project-dist');
const filePath = path.join(folderPath, 'bundle.css');
const stylesFolderPath = path.join(__dirname, 'styles');

fs.mkdir(folderPath, { recursive: true })
  .then(() => fs.readdir(stylesFolderPath))
  .then(styleFiles => {
    return fs.writeFile(filePath, '')
      .then(() => Promise.all(styleFiles.map(file => {
        if (path.extname(file) === '.css') {
          const styleFilePath = path.join(stylesFolderPath, file);
          return fs.readFile(styleFilePath, 'utf-8')
          .then(content => fs.appendFile(filePath, content));
        } else {
          return Promise.resolve();
        }
      })));
  })
