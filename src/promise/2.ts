/*
 * @Description: 基础的promise， 可以处理同步，异步，和一个then函数
 */

// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

type Istatus = "PENDING" | "FULFILLED" | "REJECTED";

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
    if (this.status === FULFILLED && onFulfilled) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED && onRejected) {
      onRejected(this.reason);
    }

    if (this.status === PENDING) {
      if (onFulfilled) {
        this.onFulfilledCallbacks.push(() => {
          onFulfilled(this.value);
        });
      }
      if (onRejected) {
        this.onRejectedCallbacks.push(() => {
          onRejected(this.reason);
        });
      }
    }
  }
}

new MyPromise((resolve, reject) => {
  // setTimeout(resolve, 2000, 123);
  resolve(1);
}).then((res) => {
  console.log(res);
});

export default MyPromise;
