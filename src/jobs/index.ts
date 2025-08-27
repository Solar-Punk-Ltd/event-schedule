import schedule from "node-schedule";
import { run as runDevcon } from "../providers/devcon";
import {
  DEVCON_EVENT_IDS,
  PRETALX_EVENT_IDS,
  UPDATE_PERIOD_MINUTES,
} from "../config";
import { DEVCON_FETCH_JOB_PREFIX, PRETALX_FETCH_JOB_PREFIX } from "../utils";

export const scheduleEventJobs = async () => {
  const cronSchedule = "*/" + UPDATE_PERIOD_MINUTES + " * * * *";

  DEVCON_EVENT_IDS.map((eventId) =>
    schedule.scheduleJob(
      `${DEVCON_FETCH_JOB_PREFIX}_${eventId}`,
      cronSchedule,
      async () => {
        console.log(
          `Scheduler job ${`${DEVCON_FETCH_JOB_PREFIX}_${eventId}`} started at: ` +
            new Date().toLocaleString() +
            " with period: " +
            UPDATE_PERIOD_MINUTES +
            " minutes (" +
            cronSchedule +
            ")"
        );

        await runDevcon(eventId);
        console.log("Scheduler job ended at:", new Date().toLocaleString());
      }
    )
  );

  PRETALX_EVENT_IDS.map((eventId) =>
    schedule.scheduleJob(
      `${PRETALX_FETCH_JOB_PREFIX}_${eventId}`,
      cronSchedule,
      async () => {
        console.log(
          `Scheduler job ${`${PRETALX_FETCH_JOB_PREFIX}_${eventId}`} started at: ` +
            new Date().toLocaleString() +
            " with period: " +
            UPDATE_PERIOD_MINUTES +
            " minutes (" +
            cronSchedule +
            ")"
        );
        // await runPretalx(eventId);
        console.log("Scheduler job ended at:", new Date().toLocaleString());
      }
    )
  );
};
