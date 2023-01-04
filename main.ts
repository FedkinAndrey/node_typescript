import * as FormData from 'form-data';
import { createReadStream, createWriteStream } from 'fs';

const readStream = createReadStream('./photo.jpeg');
const writeStream = createWriteStream('./file.txt');

const form = new FormData();
form.append('photo', readStream);
form.append('firstName', 'Marcin');
form.append('lastName', 'Wanago');

console.log(form.getHeaders());

form.pipe(writeStream);
