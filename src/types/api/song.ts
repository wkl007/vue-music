export interface SongUrlReq {
  mid: string[];
}

export interface SongUrlResp {
  map: {
    [key: string]: string;
  }
}

export interface LyricResp {
  lyric: string;
}
