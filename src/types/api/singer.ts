export interface Singer {
  id: number;
  mid: string;
  name: string;
  pic: string;
}

export interface Singers {
  title: string;
  list: Singer[];
}

export interface SingerListResp {
  singers: Singers[];
}

export interface SingerDetailReq {
  mid: string;
}
