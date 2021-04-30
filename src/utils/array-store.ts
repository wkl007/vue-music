import { saveStorage, loadStorage, removeStorage } from '@/utils/cache'

/**
 * 数组中插入元素
 * @param arr
 * @param val
 * @param compare
 * @param maxLen
 */
function insertArray<T> (arr: T[], val: T, compare: (item: T) => boolean, maxLen: number) {
  const index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) arr.splice(index, 1)
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) arr.pop()
}

/**
 * 数组中删除元素
 * @param arr
 * @param compare
 */
function deleteFromArray<T> (arr: T[], compare: (item: T) => boolean) {
  const index = arr.findIndex(compare)
  if (index > -1) arr.splice(index, 1)
}

/**
 * 保存
 * @param item
 * @param key
 * @param compare
 * @param maxLen
 */
export function save<T> (item: T, key: string, compare: (item: T) => boolean, maxLen: number): T[] {
  const items = loadStorage(key, []) as T[]
  insertArray(items, item, compare, maxLen)
  saveStorage(key, items)
  return items
}

/**
 * 移除
 * @param key
 * @param compare
 */
export function remove<T> (key: string, compare: (item: T) => boolean): T[] {
  const items = loadStorage(key, []) as T[]
  deleteFromArray(items, compare)
  saveStorage(key, items)
  return items
}

/**
 * 获取
 * @param key
 */
export function load<T> (key: string): T[] {
  return loadStorage(key, []) as T[]
}

/**
 * 移除
 * @param key
 */
export function clear<T> (key: string): T[] {
  removeStorage(key)
  return []
}

/**
 * 保存所有
 * @param items
 * @param key
 */
export function saveAll<T> (items: T[], key: string): void {
  saveStorage(key, items)
}
