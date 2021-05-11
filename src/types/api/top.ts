export interface Song {
  id: number;
  singerName: string;
  songName: string;
}

export interface Top {
  id: number;
  pic: string;
  name: string;
  period: string;
  songList: Song[];
}

export interface TopListResp {
  topList: Top[];
}
