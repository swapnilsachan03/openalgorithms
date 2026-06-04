import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import { prisma } from "@lib/prisma";

import type { User, Session } from "@prisma/client";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);

  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const session: Session = {
    sessionToken,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  };

  await prisma.session.create({
    data: session,
  });

  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const result = await prisma.session.findUnique({
    where: {
      sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expires.getTime()) {
    await prisma.session.delete({
      where: { sessionToken: session.sessionToken },
    });

    return { session: null, user: null };
  }

  if (Date.now() >= session.expires.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await prisma.session.update({
      where: {
        sessionToken: session.sessionToken,
      },
      data: {
        expires: session.expires,
      },
    });
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { sessionToken: sessionId } });
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
