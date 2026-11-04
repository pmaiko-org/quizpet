import { UnauthorizedException } from "@nestjs/common";
import { GoogleOAuthStateService } from "./google-oauth-state.service";

const createService = () => {
  const redis = {
    set: jest.fn(() => Promise.resolve("OK")),
    getdel: jest.fn((): Promise<string | null> => Promise.resolve("null")),
  };
  return {
    redis,
    service: new GoogleOAuthStateService(redis as never),
  };
};

describe("GoogleOAuthStateService", () => {
  it("round-trips the MCP interaction return path", async () => {
    const { redis, service } = createService();
    const returnTo = "/backend/oauth/interaction/interaction-id";
    const state = await service.create(returnTo);
    redis.getdel.mockResolvedValueOnce(returnTo);

    await expect(service.consume(state, state)).resolves.toBe(returnTo);
  });

  it("rejects an already consumed state", async () => {
    const { redis, service } = createService();
    redis.getdel.mockResolvedValueOnce(null);

    await expect(service.consume("state", "state")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
