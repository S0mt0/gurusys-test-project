import { StatusCodes as status } from "http-status-codes";

import { ErrorData } from "@/interface";

/**
 * Custom Error that extends the global Error object
 * @constructor {ErrorData} data
 * @constructor {number} statusCode
 * @constructor {string} message
 */
export class CustomError extends Error {
  constructor(
    message?: string,
    public data?: ErrorData,
    public statusCode: number = status.BAD_REQUEST,
    public code?: string | number
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, CustomError.prototype);
    this.data = data;
  }
}

/**
 * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
 */
export class AuthorizationError extends CustomError {
  constructor(message: string = "Unauthorized", data?: ErrorData) {
    super(message, data, status.FORBIDDEN);
  }
}

/**
 * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
 */
export class AuthenticationError extends CustomError {
  constructor(message: string = "Unauthenticated", data?: ErrorData) {
    super(message, data, status.UNAUTHORIZED);
  }
}

/**
 * This error means that server could not understand the request due to invalid syntax.
 */
export class BadRequestError extends CustomError {
  constructor(message?: string, data?: ErrorData, code?: number | string) {
    super(message, data, status.BAD_REQUEST, code);
  }
}

/** This response is sent when a request conflicts with the current state of the server */
export class DuplicateRequestError extends CustomError {
  constructor(
    message: string = "Duplicate request. Try again.",
    data?: ErrorData,
    code?: number | string
  ) {
    super(message, data, status.CONFLICT, code);
  }
}

/** The server encountered an unexpected condition that prevented it from fulfilling the request. */
export class ServerError extends CustomError {
  constructor(
    message: string = "Something went wrong, please try again later.",
    data?: ErrorData
  ) {
    super(message, data, status.INTERNAL_SERVER_ERROR);
  }
}

/**
 * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
 */
export class ServerDown extends CustomError {
  constructor(
    message: string = "We are currently undergoing maintenance, please check back later.",
    data?: ErrorData
  ) {
    super(message, data, status.SERVICE_UNAVAILABLE);
  }
}

/**
 * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
 */
export class NotFoundError extends CustomError {
  constructor(
    message: string = "Resource not found, try again later.",
    data?: ErrorData
  ) {
    super(message, data, status.NOT_FOUND);
  }
}

/**
 * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
 */
export class BadGatewayError extends CustomError {
  constructor(
    message: string = "Something went wrong, try again later.",
    data?: ErrorData,
    code?: number | string
  ) {
    super(message, data, status.BAD_GATEWAY, code);
  }
}
