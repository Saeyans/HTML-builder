const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
  }
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
      }
      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.extname(file).slice(1);
        const fileSize = stats.size / 1024;
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    });
  });
});