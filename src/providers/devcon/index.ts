import { mkdir, readFile, writeFile } from "fs/promises";
import {
  SessionItem,
  SessionRoot,
  SimplifiedSessionItem,
  Version,
} from "./models";
import {
  DEVCON_FEED_TOPIC_PREFIX,
  getEventDatesMapping,
  getSlotsInterval,
  OK_STATUS,
  updateFeed,
  uploadData,
} from "../../utils";
import { DEVCON_API_URL, FEED_TOPIC_SUFIX, STAMP } from "../../config";
import { getJSON } from "../../api";
import { dirname } from "path";

const FOLDER_PATH = "/src/assets/devcon";
const VERSION_FILE_NAME = "version.json";
const NEW_SESSION_FILE_PREFIX = "sessions_asc_";
const NEW_SORTED_SESSION_FILE_PREFIX = "sessions_sorted_by_day_asc_";

const getStoredVersion = async (eventId: string): Promise<Version | null> => {
  let version = null;
  const relativePath = `${FOLDER_PATH}/${eventId}/${VERSION_FILE_NAME}`;
  const fullPath = `${process.cwd()}${relativePath}`;

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
  const fullPath = `${process.cwd()}${relativePath}`;

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

    const sessions = await getJSON<SessionRoot>(
      `${DEVCON_API_URL}/sessions?size=600&sort=slot_start&order=asc&event=${eventId}`
    );

    if (sessions === null) {
      return;
    }

    storeInFile(
      sessions,
      `${FOLDER_PATH}/${eventId}/${NEW_SESSION_FILE_PREFIX}${currentVersion.data}.json`
    );

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

    const items: SimplifiedSessionItem[] = sessions.data.items.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ speakers, ...rest }: SessionItem) => ({
        ...rest,
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

    const uploadReference = await uploadData(STAMP, data);

    if (uploadReference === null) {
      console.log("canot update feed because of invalid reference");
      return null;
    }

    await updateFeed(
      `${DEVCON_FEED_TOPIC_PREFIX}_${eventId}_${FEED_TOPIC_SUFIX}`,
      STAMP,
      uploadReference
    );
  }
};
