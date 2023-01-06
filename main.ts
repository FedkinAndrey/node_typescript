import { Worker, MessageChannel } from 'worker_threads';

const { port1, port2 } = new MessageChannel();

const worker = new Worker('./worker.js', {
  workerData: {
    path: './worker.ts',
  },
});

port1.on('message', (result) => {
  console.log(result);
});

// worker.postMessage({ port: port2, value: 15 }, [port2]);

const array = new Uint8Array([11, 12, 13, 14, 15]);

worker.postMessage({ port: port2, value: array }, [port2, array.buffer]);
console.log(array.buffer);
