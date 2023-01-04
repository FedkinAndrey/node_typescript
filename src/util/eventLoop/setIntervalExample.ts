let i = 0;

const id = setInterval(() => {
  console.log(++i);
  if (i > 10) clearInterval(id);
}, 50);

// recursive  setTimeout
let index = 0;

function increment() {
  console.log(++index);
  if (index <= 10) {
    setTimeout(increment, 50);
  }
}

increment();
