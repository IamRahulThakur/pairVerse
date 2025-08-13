// notificationCleanup.js
import { notificationModel } from "../model/notifications.js";
import cron from "node-cron";

export function startCleanNotifications() {
  cron.schedule("*/5 * * * *", async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setMinutes(cutoffDate.getMinutes() - 5); // 5 minutes ago
            await notificationModel.deleteMany({
            updatedAt: { $lt: cutoffDate },
            status: "read",
        });

    } catch (error) {
        console.error(
            `[Notification Cleanup] Error deleting notifications at ${new Date().toISOString()}:`,
            error
        );
    }
  });
}
