import NoResult from '@/components/base/no-result/index.vue';
import { createDirective } from '@/utils/create-directive';

const noResultDirective = createDirective(NoResult);

/**
 * no-result 指令
 * @param app
 */
export function setupNoResultDirective(app) {
  app.directive('no-result', noResultDirective);
}

export default noResultDirective;
