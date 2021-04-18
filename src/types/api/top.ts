export interface SongList {
  id: number;
  singerName: string;
  songName: string;
}

export interface TopList {
  id: number;
  pic: string;
  name: string;
  period: string;
  songList: SongList[];
}

export interface TopListResp {
  topList: TopList[];
}
