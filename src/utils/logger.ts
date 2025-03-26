import winston from "winston";
import env from "../config/env";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: env.NODE_ENV === "production" ? "info" : "debug",
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
