import { parentPort } from 'worker_threads';
import Data from './Data';

function factorial(n: number): number {
  if (n === 1 || n === 0) {
    return 1;
  }
  return factorial(n - 1) * n;
}

// parentPort.on('message', (data: Data) => {
//   const { port } = data;
//   port.postMessage(factorial(data.value));
// });

parentPort.on('message', (data: Data) => {
  const { port, value } = data;
  Array.isArray(value) &&
    value.forEach((number) => {
      port.postMessage(factorial(number));
    });
});
