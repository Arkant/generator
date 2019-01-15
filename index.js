function sum(a, b) {
    return a + b;
}
var num = 20;
var obj = {name: 'ivan'}
var prom = new Promise( res => {
  setTimeout(res, 1000, 10);
});

function *gen() {
  const a = yield () => sum(1,2);
  const b = yield prom;
  const c = yield num;
  const d = yield obj;
  console.log('a', a)
  console.log('b', b)
  console.log('c', c)
  console.log('d', d)
}

const iterator = gen();

function check (item, array) {
    if (item instanceof Promise) {
      return item.then(data => {
        array.push(data);
        return data
      });
    } else if (typeof item === 'function') {
        array.push(item());
        return item()
    } else if (typeof item === 'undefined'){
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
    value = next.value;
    result = check(value, array);
  }
  return array;
}

runner(iterator).then(data => console.log(data));