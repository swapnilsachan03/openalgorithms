import { NextFunction, Request, Response } from "express";

import { validateSessionToken } from "@utils/auth_utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Please login to continue" });
    return;
  }

  const sessionRes = await validateSessionToken(token);

  if (sessionRes.session === null) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  next();
};
