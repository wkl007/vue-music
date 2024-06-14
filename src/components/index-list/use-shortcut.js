import { computed, ref } from 'vue';

export function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 10; // 单个锚点高度
  const scrollRef = ref();

  const shortcutList = computed(() => {
    return props.data.map((item) => item.title);
  });

  const touch = {};

  /** 滚动开始 */
  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    touch.anchorIndex = anchorIndex;
    scrollTo(anchorIndex);
  }

  /** 滚动进行 */
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    let delta = 0;
    let anchorIndex = 0;
    if (touch.y1) delta = Math.ceil((touch.y2 - touch.y1) / ANCHOR_HEIGHT);
    if (touch.anchorIndex) anchorIndex = touch.anchorIndex + delta;
    scrollTo(anchorIndex);
  }

  /** 滚动到具体元素 */
  function scrollTo(index) {
    if (isNaN(index)) return;
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetEl, 0);
  }

  return {
    scrollRef,
    shortcutList,

    onShortcutTouchStart,
    onShortcutTouchMove,
  };
}
