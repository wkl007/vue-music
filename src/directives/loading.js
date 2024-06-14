import Loading from '@/components/base/loading/index.vue';
import { createDirective } from '@/utils/create-directive';

const loadingDirective = createDirective(Loading);

/**
 * loading 指令
 * @param app
 */
export function setupLoadingDirective(app) {
  app.directive('loading', loadingDirective);
}

export default loadingDirective;
