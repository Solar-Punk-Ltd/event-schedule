import schedule from "node-schedule";
import { run as runDevcon } from "../providers/devcon";
import { UPDATE_PERIOD_MINUTES } from "../config";
import { DEVCON_JOB_NAME } from "../utils";

export const scheduleSessionUpdateJob = async () => {
  const cronSchedule = "* */" + UPDATE_PERIOD_MINUTES + " * * * *";
  schedule.scheduleJob(DEVCON_JOB_NAME, cronSchedule, async () => {
    console.log(
      "Scheduler job started at: " +
        new Date().toLocaleString() +
        " with period: " +
        UPDATE_PERIOD_MINUTES +
        " minutes (" +
        cronSchedule +
        ")"
    );

    await runDevcon();
    console.log("Scheduler job ended at:", new Date().toLocaleString());
  });
};
