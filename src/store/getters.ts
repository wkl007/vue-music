import type { State } from '@/types/store'

export const currentSong = (state: State) => state.playList[state.currentIndex] || {}
