import { NextFunction, Response, Request } from "express";
import { StatusCodes as status } from "http-status-codes";

import { CustomError } from "../errors/errors";
import { envs } from "../../config";

/**
 * This is a custom middleware that handles all errors thrown within or outside an asynchronous function call.
 *
 * Note that throughout the app, there was no need to wrap most asynchronous function calls within a try-catch block due to the presence of 'express-async-error' module declared at the top of the app entry -- This module is equivalent to wrapping the entire app within a try-catch block as it automatically throws any error arising from all asynchronous actions which then gets caught up and handled by this errorHandler.
 *
 * @returns Server Response */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error only in development environment
  envs.env === "development" &&
    console.log(
      "[API ERROR]: ",
      err.message,
      "\n\nERROR STACK: ",
      err.stack,
      "\n\nTIMESTAMP: ",
      new Date().toLocaleTimeString()
    );

  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message, data: err.data });
  }

  if (err.name === "ValidationError")
    return res
      .status(status.BAD_REQUEST)
      .json({ success: false, message: err.message });

  if (err instanceof CustomError && err?.code === "EAUTH")
    return res.status(status.BAD_GATEWAY).json({
      success: false,
      message: err.message,
      data: err.data,
    });

  return res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: Object.keys(err).length
      ? err
      : err.message || "Something unexpected happened, try again.",
  });
};
