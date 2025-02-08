import { SHALLOW } from "../consts";

export type ShallowObject<T> = T & {
  [SHALLOW]: boolean;
};
// interface MarkShallowOptions {
//   // deep?: number;
// }
/**
 * 标记一个对象为浅层响应式，只响应第一层属性的变化
 *
 * @param obj
 * @returns
 */
export function markShallow<T = any>(obj: T): ShallowObject<T> {
  (obj as ShallowObject<T>)[SHALLOW] = true;
  return obj as ShallowObject<T>;
}
