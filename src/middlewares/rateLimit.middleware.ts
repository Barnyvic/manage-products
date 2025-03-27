import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, 
  legacyHeaders: false, 
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: 5, 
  message:
    "Too many login attempts from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
