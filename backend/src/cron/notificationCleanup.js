// notificationCleanup.js
import { notificationModel } from "../model/notifications.js";
import cron from "node-cron";

export function startCleanNotifications() {
  cron.schedule("0 0 * * *", async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
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
