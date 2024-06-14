import storage from 'good-storage';

/**
 * 设置本地存储
 * @param key
 * @param value
 */
export function saveStorage(key, value) {
  storage.set(key, value);
  return value;
}

/**
 * 获取本地存储
 * @param key
 * @param defaultValue
 */
export function loadStorage(key, defaultValue) {
  return storage.get(key, defaultValue);
}

/**
 * 删除本地存储
 * @param key
 */
export function removeStorage(key) {
  storage.remove(key);
}

/**
 * 保存会话存储
 * @param key
 * @param value
 */
export function saveSessionStorage(key, value) {
  storage.session.set(key, value);
  return value;
}

/**
 * 获取会话存储
 * @param key
 * @param defaultValue
 */
export function loadSessionStorage(key, defaultValue) {
  return storage.session.get(key, defaultValue);
}

/**
 * 删除会话存储
 * @param key
 */
export function removeSessionStorage(key) {
  storage.session.remove(key);
}
