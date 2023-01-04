// import { request, RequestOptions } from 'https';

import { IncomingHttpHeaders, request, RequestOptions } from 'http';

interface Response {
  data: object;
  headers: IncomingHttpHeaders;
}

export function performRequest(options: RequestOptions) {
  return new Promise((resolve, reject) => {
    request(options, function (response) {
      const { statusCode, headers } = response;
      if (statusCode >= 300) {
        reject(new Error(response.statusMessage));
      }
      const chunks: Uint8Array[] = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const data = Buffer.concat(chunks).toString();
        const result: Response = {
          data: JSON.parse(data),
          headers,
        };
        resolve(result);
      });
    }).end();
  });
}
