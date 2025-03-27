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
import healthRoute from "./routes/health.route";

const createApp = (): Application => {
  const app = express();

  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/health", healthRoute);

  app.use("/api/v1/auth", authLimiter);
  app.use("/api/v1", generalLimiter);

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/products", productRoute);

  app.use(errorMiddleware);

  return app;
};

export default createApp;
