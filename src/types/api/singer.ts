export interface List {
  id: number;
  mid: string;
  name: string;
  pic: string;
}

export interface Singer {
  title: string;
  list: List[];
}

export interface SingerListResp {
  singers: Singer[];
}

export interface SingerDetailReq {
  mid: string;
}
