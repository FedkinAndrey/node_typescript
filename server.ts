import * as util from 'util';
import * as fs from 'fs';
import * as https from 'https';

const readFile = util.promisify(fs.readFile);

async function startServer() {
  const [key, cert] = await Promise.all([readFile('key.pem'), readFile('certificate.pem')]);
  https
    .createServer({ key, cert }, (req, res) => {
      res.statusCode = 200;
      res.end('hello world');
    })
    .listen(8000, () => {
      console.log('Server started');
    });
}

startServer();
