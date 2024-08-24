import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const key = process.env.JWT_SECRET || "123456";

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ msg: "Authorization header not found" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ msg: "Token Not Found" });
  }
  try {
    const verification = jwt.verify(token, key);
    // @ts-ignore
    req.id = verification.id;
    next();
  } catch (e) {
    return res.status(400).json({ msg: "Jwt expired / Incorrect" });
  }
};

export default authenticationMiddleware;
