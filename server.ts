import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Stream } from 'stream';
import { writeFile } from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import multiparty from 'multiparty';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const multiparty = require('multiparty');

const port = 3000;

interface Post {
  title: string;
  content: string;
}

const posts: Post[] = [
  {
    title: 'Lorem ipsum',
    content: 'Dolor sit amet',
  },
];

/*
const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  switch (request.url) {
    case '/posts': {
      response.setHeader('Content-Type', 'application/json');
      if (request.method === 'GET') {
        response.end(JSON.stringify(posts));
      } else if (request.method === 'POST') {
        getJSONDataFromRequestStream<Post>(request).then((post) => {
          posts.push(post);
          response.end(JSON.stringify(post));
        });
      }
      break;
    }
    default: {
      response.statusCode = 404;
      response.end();
    }
  }
});

function getJSONDataFromRequestStream<T>(request: IncomingMessage): Promise<T> {
  return new Promise((resolve) => {
    const chunks: Uint8Array[] = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      resolve(JSON.parse(Buffer.concat(chunks).toString()));
    });
  });
}

*/

/*
const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  switch (request.url) {
    case '/upload': {
      if (request.method === 'POST') {
        const chunks: Uint8Array[] = [];
        request.on('data', (chunk) => {
          chunks.push(chunk);
        });
        request.on('end', () => {
          const result = Buffer.concat(chunks).toString();
          response.end(result);
        });
      }
      break;
    }
    default: {
      response.statusCode = 404;
      response.end();
    }
  }
});
*/

function getDataFromStream(stream: Stream): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

function handleWriting(fields: Map<string, string>, photoBuffer: Buffer, filename: string) {
  writeFile(`files/${fields.get('firstName')}-${fields.get('lastName')}-${filename}`, photoBuffer, () => {
    console.log(`${fields.get('firstName')} ${fields.get('lastName')} uploaded a file`);
  });
}

async function handleFieldPart(part: multiparty.Part, fields: Map<string, string>) {
  return getDataFromStream(part).then((value) => {
    fields.set(part.name, value.toString());
  });
}

function parseTheForm(request: IncomingMessage) {
  const form = new multiparty.Form();
  form.parse(request);

  const fields = new Map();
  let photoBuffer: Buffer;
  let filename: string;

  form.on('part', async function (part: multiparty.Part) {
    if (!part.filename) {
      await handleFieldPart(part, fields);
      part.resume();
    }
    if (part.filename) {
      filename = part.filename;
      photoBuffer = await getDataFromStream(part);
    }
  });

  form.on('close', () => handleWriting(fields, photoBuffer, filename));
}

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  switch (request.url) {
    case '/upload': {
      if (request.method === 'POST') {
        parseTheForm(request);
      }
      break;
    }
    default: {
      response.statusCode = 404;
      response.end();
    }
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
