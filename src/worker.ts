// import { parentPort, workerData } from 'worker_threads';
import * as worker from 'node:worker_threads';

function factorial(n: number): number {
  if (n === 1 || n === 0) {
    return 1;
  }
  return factorial(n - 1) * n;
}

worker.parentPort.postMessage(factorial(worker.workerData.value));
