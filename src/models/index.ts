export interface AgendaSession {
  id: string;
  title: string;
  slot_start: string;
  slot_end: string;
  track: string;
  slot_roomId: string;
}

export type TextProperty = Record<"en", string>;

export type SubmissionState =
  | "submitted"
  | "accepted"
  | "confirmed"
  | "rejected"
  | "canceled"
  | "withdrawn"
  | "deleted"
  | "draft";

export interface PretalxRoom {
  id: number;
  name: TextProperty;
  description: TextProperty | null;
  uuid: string;
  guid: string | null;
  capacity: number | null;
  position: number | null;
}

export interface PretalxTrack {
  id: number;
  name: TextProperty;
  description: TextProperty;
  color: string;
  position: number | null;
  requires_access_code: boolean;
}

export interface PretalxSubmission {
  code: string;
  title: string;
  speakers: string[];
  submission_type: number;
  track: PretalxTrack | number | null;
  tags: number[];
  state: SubmissionState;
  abstract: string | null;
  description: string | null;
  duration: number;
  slot_count: number;
  content_locale: string;
  do_not_record: boolean;
  image: string;
  resources: number[];
  slots: number[];
  answers: number[];
}

export interface PretalxTalkSlot {
  id: number;
  room: PretalxRoom | number | null;
  start: string | null; // ISO 8601 date-time string
  end: string; // ISO 8601 date-time string
  submission: PretalxSubmission | string;
  schedule: number;
  description: TextProperty | null;
  duration: number;
}
