import { Response } from "express";
import { ApiResponse } from "../interfaces/response.interface";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response<ApiResponse<T>> => {
  return sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500
): Response<ApiResponse<null>> => {
  return sendResponse(res, statusCode, false, message);
};
