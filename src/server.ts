import "dotenv/config";
import App from "./app";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

const app = new App().app;
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
