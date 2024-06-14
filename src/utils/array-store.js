import { loadStorage, removeStorage, saveStorage } from '@/utils/cache.js';

/**
 * 数组中插入元素
 * @param arr
 * @param val
 * @param compare
 * @param maxLen
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) return;
  if (index > 0) arr.splice(index, 1);
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) arr.pop();
}

/**
 * 数组中删除元素
 * @param arr
 * @param compare
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) arr.splice(index, 1);
}

/**
 * 保存
 * @param item
 * @param key
 * @param compare
 * @param maxLen
 */
export function save(item, key, compare, maxLen) {
  const items = loadStorage(key, []);
  insertArray(items, item, compare, maxLen);
  saveStorage(key, items);
  return items;
}

/**
 * 移除
 * @param key
 * @param compare
 */
export function remove(key, compare) {
  const items = loadStorage(key, []);
  deleteFromArray(items, compare);
  saveStorage(key, items);
  return items;
}

/**
 * 获取
 * @param key
 */
export function load(key) {
  return loadStorage(key, []);
}

/**
 * 移除
 * @param key
 */
export function clear(key) {
  removeStorage(key);
  return [];
}

/**
 * 保存所有
 * @param items
 * @param key
 */
export function saveAll(items, key) {
  saveStorage(key, items);
}
