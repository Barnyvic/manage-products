import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoute from "./routes/auth.route";
import productRoute from "./routes/product.route";

const createApp = (): Application => {
  const app = express();

  // Initialize middlewares
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize routes
  app.use("/api/auth", authRoute);
  app.use("/api/products", productRoute);

  // Initialize error handling
  app.use(errorMiddleware);

  return app;
};

export default createApp;
