const fs = require('fs').promises;
const path = require('path');
const folderPath = path.join(__dirname);
const projectFolderPath = path.join(folderPath, 'project-dist');
const componentsFolderPath = path.join(folderPath, 'components');
const filePath = path.join(projectFolderPath, 'style.css');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(projectFolderPath, 'assets');

fs.mkdir(projectFolderPath, { recursive: true })
  .then(() => fs.readFile(path.join(folderPath, 'template.html'), 'utf-8'))
  .then((templateContent) => {
    const templateTags = templateContent.match(/{{\w+}}/g);
    if (templateTags) {
      const tagPromises = templateTags.map((tag) => {
        const tagName = tag.slice(2, -2);
        const filePath = path.join(componentsFolderPath, `${tagName}.html`);
        return fs.readFile(filePath, 'utf-8');
      })
      return Promise.all(tagPromises)
        .then((fileContent) => {
          templateTags.forEach((tag, index) => {
            templateContent = templateContent.replace(tag, fileContent[index]);
          });
          return templateContent;
        });
      }
    return templateContent;
  })
  .then((updatedContent) => fs.writeFile(path.join(projectFolderPath, 'index.html'), updatedContent))
  .then(() => fs.readdir(stylesFolderPath))
  .then(styleFiles => {
    return fs.writeFile(filePath, '')
      .then(() => Promise.all(styleFiles.map(file => {
        if (path.extname(file) === '.css') {
          const styleFilePath = path.join(stylesFolderPath, file);
          return fs.readFile(styleFilePath, 'utf-8')
          .then(content => fs.appendFile(filePath, content));
        }  else {
          return Promise.resolve();
        }  
      })));
  })
  .then(() => {
  return fs.access(assetsFolderPath)
    .catch(() => fs.mkdir(assetsFolderPath));
  })
  .then(() => {
    return fs.readdir(path.join(folderPath, 'assets'));
  })
  .then((files) => {
    const copyPromises = files.map((file) => {
      const filePath = path.join(folderPath, 'assets', file);
      const copyFilePath = path.join(assetsFolderPath, file);
      return fs.stat(filePath)
      .then((stats) => {
        if (stats.isDirectory()) {
          return fs.mkdir(copyFilePath, { recursive: true })
            .then(() => {
              return fs.readdir(filePath)
                .then((nestedFiles) => {
                    const nestedCopyPromises = nestedFiles.map((nestedFile) => {
                      const nestedFilePath = path.join(filePath, nestedFile);
                      const nestedCopyFilePath = path.join(copyFilePath, nestedFile);
                      return fs.copyFile(nestedFilePath, nestedCopyFilePath);
                    });
                    return Promise.all(nestedCopyPromises);
                });
            });
        } else {
          return fs.copyFile(filePath, copyFilePath);
        }
      });
    });
    return Promise.all(copyPromises);
  })