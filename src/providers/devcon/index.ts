import { readFile, writeFile } from "fs/promises";
import {
  SessionItem,
  SessionRoot,
  SimplifiedSessionItem,
  Version,
} from "./models";
import {
  getEventDatesMapping,
  OK_STATUS,
  updateFeed,
  uploadData,
} from "../../utils";
import {
  DEVCON_SESSIONS_API_URL,
  DEVCON_VERSION_API_URL,
  FEED_TOPIC,
  STAMP,
} from "../../config";
import { getJSON } from "../../api";

const FOLDER_PATH = "/src/assets/devcon/";
const VERSION_FILE_NAME = "version.json";
const NEW_SESSION_FILE_PREFIX = "all_devcon_7_sessions_asc_";
const NEW_SORTED_SESSION_FILE_PREFIX =
  "all_devcon_7_sessions_sorted_by_day_asc_";

const getStoredVersion = async (): Promise<Version | null> => {
  let version = null;
  const relativePath = `${FOLDER_PATH}${VERSION_FILE_NAME}`;
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
    await writeFile(fullPath, JSON.stringify(data, null, 2));
    console.log("new data written to file: ", fullPath);
  } catch (e) {
    console.log("error writing file", e);
    return;
  }
};

export const run = async () => {
  const currentVersion = await getJSON<Version>(DEVCON_VERSION_API_URL);
  const storedVersion = await getStoredVersion();

  if (
    currentVersion !== null &&
    currentVersion.status === OK_STATUS &&
    (!storedVersion || storedVersion.data !== currentVersion.data)
  ) {
    storeInFile(currentVersion, `${FOLDER_PATH}${VERSION_FILE_NAME}`);

    const sessions = await getJSON<SessionRoot>(DEVCON_SESSIONS_API_URL);

    if (sessions === null) {
      return;
    }

    storeInFile(
      sessions,
      `${FOLDER_PATH}${NEW_SESSION_FILE_PREFIX}${currentVersion.data}.json`
    );

    const daysMap = getEventDatesMapping();
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
      `${FOLDER_PATH}${NEW_SORTED_SESSION_FILE_PREFIX}${currentVersion.data}.json`
    );

    const uploadReference = await uploadData(STAMP, data);

    if (uploadReference === null) {
      console.log("canot update feed because of invalid reference");
      return null;
    }

    await updateFeed(FEED_TOPIC, STAMP, uploadReference);
  }
};
