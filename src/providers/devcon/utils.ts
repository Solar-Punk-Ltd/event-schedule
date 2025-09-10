import {
  PretalxRoom,
  PretalxSubmission,
  PretalxTalkSlot,
  PretalxTrack,
} from "../../models";
import { DeepPartial, hashStringToNumber } from "../../utils";
import { SessionItem } from "./models";

export const mapToPretalxSlot = (
  item: SessionItem
): DeepPartial<PretalxTalkSlot> => ({
  id: hashStringToNumber(item.id),
  start: item.slot_start,
  end: item.slot_end,
  description: {
    en: item.title,
  },
  room: {
    name: {
      en: item.slot_roomId,
    },
  } as PretalxRoom,
  submission: {
    track: {
      name: {
        en: item.track,
      },
    } as PretalxTrack,
  } as PretalxSubmission,
});
