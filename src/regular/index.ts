/**
 * 断言(?=xxx) (?!xxx) (?<=xxx) (?<!xxx)
 */

let s = "abcdcdf";
let reg = /d(?=c)/gi;

console.log(s.replace(reg, "哈哈"));
console.log(s.replace(/d(?!c)/g, "哈哈"));
