import schedule from "node-schedule";
import { run as runDevcon } from "../providers/devcon";
import { DEVCON_EVENT_ID, UPDATE_PERIOD_MINUTES } from "../config";
import { DEVCON_FETCH_JOB_PREFIX } from "../utils";

export const scheduleEventJobs = async () => {
  const cronSchedule = "*/" + UPDATE_PERIOD_MINUTES + " * * * *";

  schedule.scheduleJob(
    `${DEVCON_FETCH_JOB_PREFIX}_${DEVCON_EVENT_ID}`,
    cronSchedule,
    async () => {
      console.log(
        `Scheduler job ${`${DEVCON_FETCH_JOB_PREFIX}_${DEVCON_EVENT_ID}`} started at: ` +
          new Date().toLocaleString() +
          " with period: " +
          UPDATE_PERIOD_MINUTES +
          " minutes (" +
          cronSchedule +
          ")"
      );

      await runDevcon(DEVCON_EVENT_ID);
      console.log("Scheduler job ended at:", new Date().toLocaleString());
    }
  );
};
