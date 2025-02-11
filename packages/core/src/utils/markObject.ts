import { isComputedDescriptorParameter } from "./isComputedDescriptorParameter";
import { isPlainObject } from "./isPlainObject";
import { markRaw } from "./markRaw";
export interface MarkObjectOptions {
  // onlyOwn?: boolean;
}
export function markObject(
  root: any,
  filterKeys?: string[],
  // options?: MarkObjectOptions
) {
  // const { onlyOwn = false } = options || {}; // 这个貌似无法判断...
  // entries 会枚举属性,
  // 但不包括function,
  // 包括了继承过来的属性
  const keys = Object.keys(root);
  keys.forEach((key) => {
    //此处为排除代理
    if (!filterKeys) {
      // 约定以 _ 开头的属性无需代理
      if (key.startsWith("_")) {
        return markRaw(root[key]);
      }
      // 如果是复杂对象不代理
      if (!isPlainObject(root[key])) {
        // computed需要代理
        if (isComputedDescriptorParameter(root[key])) {
          return;
        }
        return markRaw(root[key]);
      }
    } else if (!filterKeys.includes(key)) {
      // 除了过滤的
      markRaw(root[key]);
    }
  });
  // 除了排除可枚举的属性,还需要排除不可枚举的属性
  // 比如 get set 等
  // 比如普通函数
  // 获取非可枚举的属性 包括各种函数
  const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(root));
  propertyNames.forEach((key) => {
    // console.log(`key`, key);
    //此处为排除代理
    if (!filterKeys) {
      // 约定以 _ 开头的属性无需代理
      if (key.startsWith("_")) {
        return markRaw(root[key]);
      }
      // 如果是复杂对象不代理
      if (!isPlainObject(root[key])) {
        // computed 需要代理
        if (isComputedDescriptorParameter(root[key])) {
          return;
        }
        return markRaw(root[key]);
      }
    } else if (!filterKeys.includes(key)) {
      // 指定代理模式
      markRaw(root[key]);
    }
  });
  return root;
}
