import { dirname, join } from "path";
import { Reference } from "@ethersphere/bee-js";
import { mkdir, readFile, writeFile } from "fs/promises";
import {
  SessionItem,
  SessionRoot,
  SimplifiedSessionItem,
  Version,
} from "./models";
import {
  getEventDatesMapping,
  getSlotsInterval,
  initFeed,
  OK_STATUS,
  updateFeed,
  uploadData,
} from "../../utils";
import { DEVCON_API_URL, FEED_TOPIC, STAMP } from "../../config";
import { getJSON } from "../../api";

const FOLDER_PATH = "/src/assets/devcon";
const VERSION_FILE_NAME = "version.json";
const NEW_SORTED_SESSION_FILE_PREFIX = "sessions_sorted_by_day_asc_";
let feedManifest: Reference | null = null;

const getStoredVersion = async (eventId: string): Promise<Version | null> => {
  let version = null;
  const relativePath = `${FOLDER_PATH}/${eventId}/${VERSION_FILE_NAME}`;
  const fullPath = join(process.cwd(), relativePath);

  try {
    const versionFileBuffer = await readFile(fullPath);
    const versionFileString = versionFileBuffer.toString();
    version = JSON.parse(versionFileString);
  } catch (e) {
    console.log("error reading version file " + fullPath, e);
  }

  return version;
};

const storeInFile = async <T>(data: T, relativePath: string) => {
  const fullPath = join(process.cwd(), relativePath);

  try {
    await mkdir(dirname(fullPath), { recursive: true });

    await writeFile(fullPath, JSON.stringify(data, null, 2));
    console.log("new data written to file: ", fullPath);
  } catch (e) {
    console.log("error writing file", e);
    return;
  }
};

export const run = async (eventId: string) => {
  const currentVersion = await getJSON<Version>(
    `${DEVCON_API_URL}/events/${eventId}/version`
  );
  const storedVersion = await getStoredVersion(eventId);

  if (
    currentVersion !== null &&
    currentVersion.status === OK_STATUS &&
    (!storedVersion || storedVersion.data !== currentVersion.data)
  ) {
    storeInFile(
      currentVersion,
      `${FOLDER_PATH}/${eventId}/${VERSION_FILE_NAME}`
    );

    const getSessionsCountResponse = await getJSON<SessionRoot>(
      `${DEVCON_API_URL}/sessions?size=0&event=${eventId}`
    );

    if (getSessionsCountResponse === null) {
      console.log("session count retrieval failed, still using the old data");
      return;
    }

    const sessionsCount = getSessionsCountResponse.data.total;

    const sessions = await getJSON<SessionRoot>(
      `${DEVCON_API_URL}/sessions?size=${sessionsCount}&sort=slot_start&order=asc&event=${eventId}`
    );

    if (sessions === null) {
      console.log("session retrieval failed, still using the old data");
      return;
    }

    const [startDate, endDate] = getSlotsInterval(
      sessions.data.items
        .filter((item) => item.slot_start !== null && item.slot_end !== null)
        .map((item) => ({
          start: item.slot_start,
          end: item.slot_end,
        }))
    );

    const daysMap = getEventDatesMapping(startDate, endDate);
    const dayKeys = Array.from(daysMap.keys());

    const sortedSessionsMap = new Map();

    for (const dayKey of dayKeys) {
      sortedSessionsMap.set(dayKey, []);
    }

    // For limiting the size of data we store, we remove the speaker avatar and session transcript.
    const items: SimplifiedSessionItem[] = sessions.data.items.map(
      ({ speakers, transcript_text, ...restOfSession }: SessionItem) => ({
        speakers: speakers.map(({ avatar, ...restOfSpeaker }) => ({
          ...restOfSpeaker,
        })),
        ...restOfSession,
      })
    );

    for (const item of items) {
      const slotStart = item.slot_start;
      if (!slotStart) continue;

      const day = new Date(slotStart).toDateString();
      let dayIndex = -1;

      for (const [key, date] of daysMap.entries()) {
        if (date === day) {
          dayIndex = dayKeys.indexOf(key);
          break;
        }
      }

      if (dayIndex === -1) {
        console.log("unknown day:", day);
        continue;
      }

      sortedSessionsMap.get(dayKeys[dayIndex])?.push(item);
    }

    const data = Object.fromEntries(sortedSessionsMap);

    storeInFile(
      data,
      `${FOLDER_PATH}/${eventId}/${NEW_SORTED_SESSION_FILE_PREFIX}${currentVersion.data}.json`
    );

    const uploadReference = await uploadData(STAMP, JSON.stringify(data));

    if (uploadReference === null) {
      console.log("cannot update feed because of invalid reference");
      return null;
    }

    if (feedManifest === null) {
      feedManifest = await initFeed(FEED_TOPIC, STAMP);
    }

    await updateFeed(FEED_TOPIC, STAMP, uploadReference);
  }
};

