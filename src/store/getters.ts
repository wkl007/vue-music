import type { State } from '@/types/store'
import type { Song } from '@/types/api/recommend'

export const currentSong = (state: State): Song => state.playList[state.currentIndex] || {}
