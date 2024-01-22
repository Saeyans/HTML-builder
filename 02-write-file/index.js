const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.join(__dirname, '02-write-file.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.access(filePath, (err) => {
  if (err) {
    fs.writeFile(filePath, '', (err) => {
      if (err) throw err;
      enterText();
    });
  } else {
    enterText();
  }
});

function enterText() {
  rl.question(`Enter text. If you need to stop typing, type 'exit' or press 'ctrl + c': `, (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Discontinued');
      rl.close();
    } else {
      fs.appendFile(filePath, input + '\n', (err) => {
        if (err) throw err;
        enterText();
      });
    }
  });
  rl.on('SIGINT', () => {
    console.log('\n' + 'Discontinued');
    rl.close();
  });
}