/**
 * 获取 0 到 max 的随机数
 * @param max
 */
function getRandomInt (max: number): number {
  return Math.floor(Math.random() * (max + 1))
}

/**
 * 数组元素交换
 * @param arr
 * @param i
 * @param j
 */
function swap<T> (arr: T[], i: number, j: number): void {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

/**
 * Knuth 洗牌算法
 * @param source
 */
export function shuffle<T> (source: T[]): T[] {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

/**
 * 格式化秒
 * @param interval
 */
export function formatTime (interval: number): string {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
