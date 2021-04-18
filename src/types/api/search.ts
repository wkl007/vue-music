import { AlbumResp } from '@/types/api/recommend'

export interface HotKey {
  key: string;
  id: number;
}

export interface HotKeyResp {
  hotKeys: HotKey[];
}

export interface SearchReq {
  query: string;
  page: number,
  showSinger: boolean;
}

export interface SearchResp extends AlbumResp {
  hasMore: boolean;
}
