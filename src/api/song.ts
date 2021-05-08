import request from '@/utils/request'
import type { SingerDetailReq } from '@/types/api/singer'
import type { LyricResp, SongUrlReq, SongUrlResp } from '@/types/api/song'
import type { Song } from '@/types/api/recommend'

interface LyricMap {
  [key: string]: string;
}

export default class SongServer {
  static getSongUrl (params: SongUrlReq): Promise<SongUrlResp> {
    return request.request({
      url: '/getSongsUrl',
      method: 'get',
      params
    })
  }

  static getLyric (params: SingerDetailReq): Promise<LyricResp> {
    return request.request({
      url: '/getLyric',
      method: 'get',
      params
    })
  }
}

/**
 * 处理获取歌曲地址
 * @param songs
 */
export function processSongs (songs: Song[]): Promise<Song[]> {
  if (!songs.length) return Promise.resolve(songs)
  return SongServer.getSongUrl({ mid: songs.map(song => song.mid) }).then(({ map }) => {
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter(song => song.url?.indexOf('vkey') >= 0)
  })
}

// 缓存歌词
const lyricMap: LyricMap = {}

/**
 * 处理歌词
 * @param song
 */
export function processLyric (song: Song): Promise<string> {
  if (song.lyric) return Promise.resolve(song.lyric)
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) return Promise.resolve(lyric)

  return SongServer.getLyric({ mid }).then(res => {
    const lyric = res ? res.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
