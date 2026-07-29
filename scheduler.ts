import cron from "node-cron";
import { medicationReminderJob } from "./modules/notifications/medicationReminder.job";

export const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await medicationReminderJob();
      console.log("Medication reminder check done");
    } catch (e) {
      console.error("Reminder error", e);
    }
  });
};
