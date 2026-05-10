import { createApp } from "./app.js";
import { PORT } from "./config.js";
import { logger } from "./lib/logger.js";

const app = await createApp();

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});
