// notificationCleanup.js
import cron from "node-cron";
import { deleteReadNotificationsOlderThanService } from "../services/notification.service.js";

export function startCleanNotifications() {
  cron.schedule("0 0 * * *", async () => {
    try {
        await deleteReadNotificationsOlderThanService();
    } catch (error) {
        console.error(
            `[Notification Cleanup] Error deleting notifications at ${new Date().toISOString()}:`,
            error
        );
    }
  });
}
