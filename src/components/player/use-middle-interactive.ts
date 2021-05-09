import { CSSProperties, Ref, ref } from 'vue'

interface UseMiddleInteractive {
  /** 当前显示 */
  currentShow: Ref<'cd' | 'lyric'>;
  /** 左侧样式 */
  middleLStyle: Ref<CSSProperties | null>;
  /** 右侧样式 */
  middleRStyle: Ref<CSSProperties | null>;
  /** 触摸开始 */
  onMiddleTouchStart: (e: TouchEvent) => void;
  /** 触摸移动 */
  onMiddleTouchMove: (e: TouchEvent) => void;
  /** 触摸结束 */
  onMiddleTouchEnd: () => void;
}

interface Touch {
  /** 开始 X 位置 */
  startX: number;
  /** 开始 Y 位置 */
  startY: number;
  /** 方向锁定 */
  directionLocked: string;
  /** 偏移比例 */
  percent?: number;
}

export function useMiddleInteractive (): UseMiddleInteractive {
  const currentShow = ref<'cd' | 'lyric'>('cd')
  const middleLStyle = ref<CSSProperties | null>(null)
  const middleRStyle = ref<CSSProperties | null>(null)

  const touch: Touch = {
    startX: 0,
    startY: 0,
    directionLocked: '',
    percent: 0
  }
  let currentView: 'cd' | 'lyric' = 'cd'

  /** 触摸开始 */
  function onMiddleTouchStart (e: TouchEvent): void {
    const { pageX, pageY } = e.touches[0]
    touch.startX = pageX
    touch.startY = pageY
    touch.directionLocked = ''
  }

  /** 触摸移动 */
  function onMiddleTouchMove (e: TouchEvent): void {
    const { pageX, pageY } = e.touches[0]
    const deltaX = pageX - touch.startX
    const deltaY = pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd'
    } else {
      currentShow.value = touch.percent < 0.8 ? 'cd' : 'lyric'
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  /** 触摸结束 */
  function onMiddleTouchEnd (): void {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,

    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
