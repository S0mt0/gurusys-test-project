import { error } from ".";

/**
 * This status code indicates that the request has not been applied because it lacks valid authentication  credentials for the target resource. This is typically used when the request requires user authentication, and the user has not provided proper authentication credentials (such as a token).
 * @param message
 * @param data
 * @statusCode 401 Unauthorized
 */
export const unauthenticatedError = (message?: string, data?: ErrorData) => {
  throw new error.AuthenticationError(message, data);
};

/** Informs the client that authentication was successful but access to the resource is not allowed due to insufficient permissions or an invalid token.
 * @param message
 * @param data
 * @statusCode 403 Forbidden
 */
export const unauthorizationError = (message?: string, data?: ErrorData) => {
  throw new error.AuthorizationError(message, data);
};

/**
 * Server encountered an unidentified error
 * @param message
 * @param data
 * @statusCode 500 Internal server error
 */
export const serverError = (message?: string, data?: ErrorData) => {
  throw new error.ServerError(message, data);
};

/**
 * Server is under maintenance
 * @param message
 * @param data
 * @statusCode 503 Service not available
 */
export const maintenanceError = (message?: string, data?: ErrorData) => {
  throw new error.ServerDown(message, data);
};

/**
 * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
 * @param message
 * @param data
 * @statusCode 404 Not found
 */
export const notfoundError = (message?: string, data?: ErrorData) => {
  throw new error.NotFoundError(message, data);
};

/**
 * This error means that server could not understand the request due to invalid syntax
 * @param message
 * @param data
 * @statusCode 400 Bad request
 */
export const badRequestError = (message?: string, data?: ErrorData) => {
  throw new error.BadRequestError(message, data);
};

/**
 * This response is sent when a request conflicts with the current state of the server
 * @param message
 * @param data
 * @statusCode 409 Conflict
 */
export const duplicateRequestError = (message?: string, data?: ErrorData) => {
  throw new error.DuplicateRequestError(message, data);
};

/**
 * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
 * @param message
 * @param data
 * @statusCode 502 Bad gateway
 */
export const badGatewayError = (message?: string, data?: ErrorData) => {
  throw new error.BadGatewayError(message, data);
};
