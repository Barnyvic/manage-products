import "dotenv/config";
import createApp from "./app";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

const startServer = async () => {
  try {
    await connectDB();
    const app = createApp();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
