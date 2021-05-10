export interface Slider {
  id: string;
  pic: string;
  link: string;
}

export interface Album {
  mid?: string;
  id: any;
  username: string;
  title: string;
  pic: string;
}

export interface RecommendResp {
  sliders: Slider[];
  albums: Album[];
}

export interface AlbumReq {
  id: string;
}

export interface Song {
  id: number;
  mid: string;
  name: string;
  singer: string;
  url: string;
  duration: number;
  pic: string;
  album: string;
  lyric?: string;
}

export interface AlbumResp {
  songs: Song[];
}
