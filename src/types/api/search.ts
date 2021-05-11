import { AlbumResp } from '@/types/api/recommend'
import { Singer } from '@/types/api/singer'

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
  singer?: Singer;
  hasMore: boolean;
}
