import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

export const randomToken = (bytes = 32) =>
  randomBytes(bytes).toString("base64url");

export const hashToken = (value: string, pepper: string) =>
  createHash("sha256").update(`${pepper}:${value}`).digest("hex");

export const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export const getCookie = (request: Request, name: string) => {
  const value = request.cookies?.[name];
  return typeof value === "string" && value ? value : null;
};

export const getRequestIp = (request: Request) =>
  request.ip || request.socket.remoteAddress || "unknown";

export const getOAuthInteractionReturnTo = (value: unknown) => {
  if (typeof value !== "string") return null;
  return /^\/backend\/oauth\/interaction\/[A-Za-z0-9_-]+$/.test(value)
    ? value
    : null;
};
