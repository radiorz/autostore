import { SHALLOW } from "../consts";

/**
 * 标记一个对象为浅层响应式，只响应第一层属性的变化
 *
 * @param obj
 * @returns
 */
export function isShallow(obj: any) {
  return !!obj?.[SHALLOW]; //
}
