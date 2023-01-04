import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);

writeFile('./newFile.txt', null)
  .then(() => {
    console.log('File created successfully');
  })
  .catch((error) => {
    console.log(error);
  });
