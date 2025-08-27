export interface Version {
  status: number;
  message: string;
  data: number;
}

export interface SessionRoot {
  status: number;
  message: string;
  data: SessionData;
}

export interface SessionData {
  total: number;
  currentPage: number;
  items: SessionItem[];
}

export interface SessionItem {
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
  speakers: SessionSpeaker[];
  slot_room: SessionSlotRoom;
}

export type SimplifiedSessionItem = Omit<
  SessionItem,
  "speakers" | "transcript_text"
>;

export interface SessionSpeaker {
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

export interface SessionSlotRoom {
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
