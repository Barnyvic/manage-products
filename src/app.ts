import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorMiddleware } from "./middlewares/error.middleware";
import {
  generalLimiter,
  authLimiter,
} from "./middlewares/rateLimit.middleware";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";

const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiting
  app.use("/api/v1/auth", authLimiter);
  app.use("/api/v1", generalLimiter);

  // Initialize routes with versioning
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/products", productRoute);

  // Initialize error handling
  app.use(errorMiddleware);

  return app;
};

export default createApp;
