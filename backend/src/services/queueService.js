import { createAndSaveNotification } from "./notificationService.js";

const jobQueue = [];

let isProcessing = false;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (jobQueue.length > 0) {
    const job = jobQueue.shift();
    console.log(`Processing background job: ${job.type}`);

    try {
      if (job.type === "createNotification") {
        await createAndSaveNotification(job.payload);
      }
    } catch (error) {
      console.error(`Job failed: ${job.type}`, error);
    }
  }

  isProcessing = false;
};

export const addJobToQueue = (type, payload) => {
  jobQueue.push({ type, payload });
  processQueue();
};
