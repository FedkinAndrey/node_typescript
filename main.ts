import * as Worker from 'node:worker_threads';

const worker = new Worker.Worker('./src/worker.ts', {
  workerData: {
    value: 15,
    path: './src/worker.ts',
  },
});

worker.on('message', (result) => {
  console.log(result);
});
