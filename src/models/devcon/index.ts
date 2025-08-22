export interface Root {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  total: number;
  currentPage: number;
  items: Item[];
}

export interface Item {
  id: string;
  sourceId: string;
  title: string;
  description: string;
  track: string;
  type: string;
  expertise?: string;
  audience: string;
  featured: boolean;
  doNotRecord: boolean;
  tags?: string;
  keywords?: string;
  duration: number | null;
  language: string;
  sources_swarmHash: string;
  sources_youtubeId: string;
  sources_ipfsHash: string | null;
  sources_livepeerId: string | null;
  sources_streamethId: string | null;
  transcript_vtt: string | null;
  transcript_text: string | null;
  eventId: string;
  slot_start: string;
  slot_end: string;
  slot_roomId: string;
  resources_presentation: string;
  resources_slides: string | null;
  speakers: Speaker[];
  slot_room: SlotRoom;
}

export interface Speaker {
  id: string;
  sourceId: string;
  name: string;
  avatar: string;
  description: string;
  twitter: string | null;
  farcaster: string | null;
  lens: string | null;
  ens: string | null;
  github: string | null;
  hash: string;
}

export interface SlotRoom {
  id: string;
  name: string;
  description: string;
  info: string;
  capacity: number;
  youtubeStreamUrl_1: string;
  youtubeStreamUrl_2: string;
  youtubeStreamUrl_3: string;
  youtubeStreamUrl_4: string;
  translationUrl: string;
}
