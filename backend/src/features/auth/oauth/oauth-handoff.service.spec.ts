import { UnauthorizedException } from "@nestjs/common";
import { OAuthHandoffService } from "./oauth-handoff.service";

const createHarness = () => {
  const values = new Map<string, string>();
  const redis = {
    set: jest.fn((key: string, value: string) => {
      values.set(key, value);
      return Promise.resolve("OK");
    }),
    getdel: jest.fn((key: string) => {
      const value = values.get(key) ?? null;
      values.delete(key);
      return Promise.resolve(value);
    }),
    incr: jest.fn(() => Promise.resolve(1)),
    expire: jest.fn(() => Promise.resolve(1)),
    del: jest.fn(() => Promise.resolve(1)),
  };
  const configService = {
    getOrThrow: jest.fn(() => "handoff-pepper-for-tests"),
  };
  const service = new OAuthHandoffService(
    redis as never,
    configService as never,
  );
  return { service, redis };
};

describe("OAuthHandoffService", () => {
  it("returns an access token only once", async () => {
    const { service } = createHarness();
    const code = await service.create("access-token");

    await expect(service.consume(code, "127.0.0.1")).resolves.toBe(
      "access-token",
    );
    await expect(service.consume(code, "127.0.0.1")).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("stores only a hash of the handoff code in the Redis key", async () => {
    const { service, redis } = createHarness();
    const code = await service.create("access-token");

    expect(redis.set.mock.calls[0]?.[0]).not.toContain(code);
  });
});
