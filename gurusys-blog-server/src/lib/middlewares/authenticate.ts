import { NextFunction, Response } from "express";

import { reject, validateObjectId, verifyAuthorization } from "../utils";
import { sendError } from "../../lib/errors";

import { Users } from "../../models";

/**
 * Verify if user has correct access to resources that they try to access.
 *
 * The middleware checks if there is an access token present in the headers of their request, that must also start with "Bearer " keyword.
 *
 * This is especially used when requested resources are unique to indiviual users i.e Users will be allowed to retrieve only data or resources that they create.
 */
export const authenticate = async (
  req: CustomRequest,
  _: Response,
  next: NextFunction
) => {
  const { data, error } = verifyAuthorization(req);
  if (error) sendError.unauthorizationError(error);

  const { userId } = data;

  if (!userId) sendError.unauthorizationError();
  validateObjectId(userId);

  const user = await Users.findById(userId);
  if (!user) reject();

  req.session = { ...req.session, user, id: userId };

  next();
};
