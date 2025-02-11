import { markRaw } from './markRaw';

export function markShallow(root: any) {
  Object.keys(root).forEach(([key]) => {
    markRaw(root[key]);
  });
  return root;
}
