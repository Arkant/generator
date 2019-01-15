function sum() {
  console.log(1);
  return [].reduce.call(arguments, (acc, el) => acc+=el);
}

const prom = x => new Promise(res => {
  console.log(2);
  setTimeout(res,2000,x);
})

function pow() {
  console.log(3);
  return [].reduce.call(arguments, (acc, el) => acc*=el);
}

const arr = [1,2,3,4]

function *gen() {
  const a = yield sum.bind(null, ...arr);
  const b = yield prom(a);
  const c = yield pow.bind(null, ...arr);
  const d = yield arr;
  console.log(a + b + c + d)
  yield a + b + c + d;
}

const iterator = gen();

function check (item, array) {
    if (item instanceof Promise) {
      item.then(data => {
        array.push(data);
        return data
      });
    } else if (typeof item === 'function') {
        array.push(item());
        return item()
    } else if (typeof item === 'undefined') {
        return;
    } else {
      array.push(item);
      return item
    }
}

async function runner(iterat) {
  let array = [];
  let next = iterat.next();
  let { value, done } = next;
  await value;
  let result = check(value, array);

  while (done === false) {
    await value;
    next = iterat.next(result);
    done = next.done;
    value = await next.value;
    result = check(value, array);
  }
  return array;
}

runner(iterator).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))