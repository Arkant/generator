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

function isPromise(value) {
  return value instanceof Promise;
}

function isFunction(value) {
  return typeof value === 'function';
}

function runner(iterator) {
  const resultArray = [];

  return new Promise(resolve => { 
    function executer(iterat, yieldValue) {
      const next = iterat.next(yieldValue);
      let { value, done } = next;
      
      if (!done) {
        if (isPromise(value)) {
          return value.then(data => {
          resultArray.push(data);
          executer(iterat, data);
        });
      } else if (isFunction(value)) {
          const data = value();
          resultArray.push(data);
          return executer(iterat, data);
      } 
        resultArray.push(value);
        executer(iterat, value);
      }

    return resolve(resultArray);
    }

    executer(iterator);
  });

}

runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You are fail this task"))