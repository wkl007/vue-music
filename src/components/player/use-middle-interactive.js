import { ref } from 'vue';

export function useMiddleInteractive() {
  const currentShow = ref('cd');
  const middleLStyle = ref(null);
  const middleRStyle = ref(null);

  const touch = {
    startX: 0,
    startY: 0,
    directionLocked: '',
    percent: 0,
  };
  let currentView = 'cd';

  /** 触摸开始 */
  function onMiddleTouchStart(e) {
    const { pageX, pageY } = e.touches[0];
    touch.startX = pageX;
    touch.startY = pageY;
    touch.directionLocked = '';
  }

  /** 触摸移动 */
  function onMiddleTouchMove(e) {
    const { pageX, pageY } = e.touches[0];
    const deltaX = pageX - touch.startX;
    const deltaY = pageY - touch.startY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v';
    }
    if (touch.directionLocked === 'v') return;

    const left = currentView === 'cd' ? 0 : -window.innerWidth;
    const offsetWidth = Math.min(
      0,
      Math.max(-window.innerWidth, left + deltaX),
    );
    touch.percent = Math.abs(offsetWidth / window.innerWidth);

    if (currentView === 'cd') {
      currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd';
    } else {
      currentShow.value = touch.percent < 0.8 ? 'cd' : 'lyric';
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
    };

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
    };
  }

  /** 触摸结束 */
  function onMiddleTouchEnd() {
    let offsetWidth;
    let opacity;
    if (currentShow.value === 'cd') {
      currentView = 'cd';
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = 'lyric';
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    const duration = 300;
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
    };
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,

    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
