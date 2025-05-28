import { schedules, logger } from "@trigger.dev/sdk/v3";

export const getTopEarningTask = schedules.task({
  id: "get-top-earning-task",
  cron: "0 * * * *",
  maxDuration: 300,
  run: async () => {
    logger.info("Calling our Update Top Earning endpoint");

    const response = await fetch(`${process.env.BASE_URL}/api/updateTopEarning`, {
      method: "POST",
      headers: {
        "Authorization": process.env.CALL_AUTH_TOKEN || "",
      },
    });

    if (!response.ok) {
      logger.error(`Failed to update top earning: ${response.statusText}`);
      return;
    }

    console.log(response);
    const data = await response.text();
    logger.info(data);
  },
});