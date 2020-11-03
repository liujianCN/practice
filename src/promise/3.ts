/*
 * @Description: 基础的promise， 可以处理同步，异步，和一个then函数
 */

// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

type Istatus = "PENDING" | "FULFILLED" | "REJECTED";

/**
 * @param promise
 * @param x then 的resolve函数的返回值
 * @param resolve then函数的返回的promise的resolve函数
 * @param reject then函数的返回promise的reject函数
 */
const resolvePromise = (promise, x, resolve, reject) => {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (promise === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }

  // let called;
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
  } else {
    // x 是普通值直接resolve
    resolve(x);
  }
};

class MyPromise {
  status: Istatus;
  value: any;
  reason: any;
  onFulfilledCallbacks: [Function?];
  onRejectedCallbacks: [Function?];

  constructor(
    executor: (
      esolve: (value?: unknown) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    // 状态
    this.status = PENDING;
    // 成功值
    this.value = undefined;
    // 失败者
    this.reason = undefined;

    // 收集resolve
    this.onFulfilledCallbacks = [];

    // 收集reject
    this.onRejectedCallbacks = [];

    // 定义resolve函数
    let resolve = (value: any) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => {
          fn();
        });
      }
    };

    // 定义reject函数
    let reject = (reason: any) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => {
          fn();
        });
      }
    };

    // 立即executor函数
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 定义then方法
  then(onFulfilled: Function, onRejected?: Function) {
    // 非函数，重置onFulfilled
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    // 因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后 then 的 resolve 中捕获
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    // 每次调用then都返回一个新的promise
    console.log(this.status);
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // then 里的代码是微任务(使用setTimeOut模拟)
        setTimeout(() => {
          try {
            //Promise/A+ 2.2.7.1
            let x = onFulfilled(this.value);
            // x可能是一个proimise
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            //Promise/A+ 2.2.7.2
            reject(e);
          }
        }, 0);
      }

      if (this.status === PENDING) {
        if (onFulfilled) {
          this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              try {
                //Promise/A+ 2.2.7.1
                let x = onFulfilled(this.value);
                // x可能是一个proimise
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                //Promise/A+ 2.2.7.2
                reject(e);
              }
            }, 0);
          });
        }
        if (onRejected) {
          this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
          });
        }
      }
    });
    return promise2;

    // if (this.status === FULFILLED && onFulfilled) {
    //   onFulfilled(this.value);
    // }

    // if (this.status === REJECTED && onRejected) {
    //   onRejected(this.reason);
    // }
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(resolve, 2000, 123);
  // resolve(1);
})
  .then((res) => {
    console.log(res);
    return 2;
  })
  .then()
  .then((a) => console.log(a));

export default MyPromise;
