import { computed } from "../computed";
import { isComputedDescriptorParameter } from "./isComputedDescriptorParameter";
import { markRaw } from "./markRaw";

export function markShallow(root: any) {
  Object.keys(root).forEach(([key]) => {
    markRaw(root[key]);
  });
  // 对于函数
  const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(root));
  propertyNames.forEach((key) => {
    // 计算属性需要代理.
    if (isComputedDescriptorParameter(root[key])) {
      return;
    }
    // 其他普通函数不代理
    markRaw(root[key]);
  });
  return root;
}
