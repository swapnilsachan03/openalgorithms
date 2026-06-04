import { Request, Response } from "express";
import { sha256 } from "@oslojs/crypto/sha2";

import { prisma } from "@lib/prisma";

import {
  createSession,
  generateSessionToken,
  validateSessionToken,
} from "@utils/auth_utils";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, image } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user !== null) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  if (!email || !password || !name) {
    res.status(400).json({ message: "Please enter the required fields" });
    return;
  }

  const hashedPassword = sha256(new TextEncoder().encode(password)).toString();

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      image,
    },
  });

  const token = generateSessionToken();
  await createSession(token, newUser.id);

  res.status(200).json({ message: "User created", user: newUser, token });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user === null) {
    res.status(401).json({ message: "This user does not exist" });
    return;
  }

  const passwordHash = sha256(new TextEncoder().encode(password)).toString();

  if (passwordHash !== user.hashedPassword) {
    res.status(401).json({ message: "Incorrect password" });
    return;
  }

  const token = generateSessionToken();
  await createSession(token, user.id);

  res.json({ token, user, message: "Logged in successfully" });
};

export const logoutUser = async (req: Request, res: Response) => {
  const bearerToken = req.headers.authorization?.split(" ")[1];

  if (!bearerToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { session } = await validateSessionToken(bearerToken);

  if (session === null) {
    res.status(200).json({ message: "Logged out" });
    return;
  }

  await prisma.session.delete({
    where: {
      sessionToken: session.sessionToken,
    },
  });

  res.status(200).json({ message: "Logged out" });
};
