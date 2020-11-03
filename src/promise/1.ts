/*
 * @Description: 基础的promise， 可以处理同步，和一个then函数
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

    // 定义resolve函数
    let resolve = (value: any) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    // 定义reject函数
    let reject = (reason: any) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
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
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED && onRejected) {
      onRejected(this.reason);
    }
  }
}

new MyPromise((resolve, reject) => {
  resolve("success");
}).then((res) => {
  console.log(res);
});

export default MyPromise;
