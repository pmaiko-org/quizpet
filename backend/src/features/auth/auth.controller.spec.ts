import type { Request, Response } from "express";
import {
  CSRF_COOKIE,
  DEVICE_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "./auth.constants";
import { AuthController } from "./auth.controller";

describe("AuthController session cookies", () => {
  it("migrates the refresh cookie to the root path", async () => {
    const tokens = {
      accessToken: "access-token",
      refreshToken: "new-refresh-token",
      sessionId: "778895d7-a9cd-43c2-884b-e0f75f937705",
      deviceIdentifier: "device-identifier",
      csrfToken: "csrf-token",
    };
    const sessionService = {
      rotate: jest.fn(() => Promise.resolve(tokens)),
    };
    const controller = new AuthController(
      {} as never,
      sessionService as never,
      {} as never,
      {} as never,
    );
    const request = {
      cookies: { [REFRESH_TOKEN_COOKIE]: "old-refresh-token" },
    } as unknown as Request;
    const cookie = jest.fn();
    const clearCookie = jest.fn();
    const response = { cookie, clearCookie } as unknown as Response;

    await controller.refresh(request, response);

    expect(clearCookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      expect.objectContaining({ path: "/backend/auth" }),
    );
    expect(cookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      expect.objectContaining({ httpOnly: true, path: "/" }),
    );
    expect(cookie).toHaveBeenCalledWith(
      DEVICE_COOKIE,
      tokens.deviceIdentifier,
      expect.objectContaining({ httpOnly: true, path: "/backend/auth" }),
    );
    expect(cookie).toHaveBeenCalledWith(
      CSRF_COOKIE,
      tokens.csrfToken,
      expect.objectContaining({ httpOnly: false, path: "/" }),
    );
  });
});
