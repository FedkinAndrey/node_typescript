import { fork } from 'child_process';

factorial(4)
  .then((result) => {
    console.log('Result: ', result);
  })
  .catch(() => {
    console.log('An error occurred');
  });

function factorial(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = fork('./child.ts');
    child.send(n);
    child.on('message', (result: number) => {
      resolve(result);
    });
    child.on('error', (err) => {
      reject(err);
    });
  });
}
