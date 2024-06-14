import { ref } from 'vue';
import animations from 'create-keyframe-animation';

export function useAnimation() {
  const cdWrapperRef = ref(document.createElement('div'));
  let entering = false;
  let leaving = false;

  /** 进入 */
  function enter(el, done) {
    if (leaving) afterLeave();
    entering = true;
    const { x, y, scale } = getPosAndScale();

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)',
      },
    };

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
    });
    animations.runAnimation(cdWrapperRef.value, 'move', done);
  }

  /** 进入之后 */
  function afterEnter() {
    entering = false;
    animations.unregisterAnimation('move');
    cdWrapperRef.value.style.animation = '';
  }

  /** 离开 */
  function leave(el, done) {
    if (entering) afterEnter();
    leaving = true;
    const { x, y, scale } = getPosAndScale();
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)';
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    cdWrapperEl.addEventListener('transitionend', next);

    function next() {
      cdWrapperEl.removeEventListener('transitionend', next);
      done();
    }
  }

  /** 离开之后 */
  function afterLeave() {
    leaving = false;
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = '';
    cdWrapperEl.style.transform = '';
  }

  /** 计算偏移量与缩放 */
  function getPosAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWidth / width;

    return {
      x,
      y,
      scale,
    };
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave,
  };
}
