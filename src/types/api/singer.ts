export interface Singer {
  id: number;
  mid: string;
  name: string;
  title?: string;
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
