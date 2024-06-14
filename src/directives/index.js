import { setupLoadingDirective } from './loading.js';
import { setupNoResultDirective } from './no-result.js';

/**
 * 注册全局指令
 * @param app
 */
export function setupDirective(app) {
  setupLoadingDirective(app);
  setupNoResultDirective(app);
}
