import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  signPreviewPayload,
  verifyPreviewToken,
} from "../src/utils/cms-preview";

const SECRET = "test-secret";

const tokenFor = (
  overrides: Partial<{ path: string; locale: string; expires: number }> = {},
  secret = SECRET,
) => {
  const payload = {
    path: overrides.path ?? "/sets",
    locale: overrides.locale ?? "uk",
    status: "draft" as const,
    expires: overrides.expires ?? Date.now() + 60_000,
  };

  return Buffer.from(
    JSON.stringify({
      ...payload,
      signature: signPreviewPayload(payload, secret),
    }),
  ).toString("base64url");
};

describe("verifyPreviewToken", () => {
  it("accepts a token signed with the configured secret", () => {
    assert.equal(
      verifyPreviewToken(tokenFor(), { path: "/sets", locale: "uk" }, SECRET),
      true,
    );
  });

  it("rejects a token signed with another secret", () => {
    assert.equal(
      verifyPreviewToken(
        tokenFor({}, "other-secret"),
        { path: "/sets", locale: "uk" },
        SECRET,
      ),
      false,
    );
  });

  it("rejects a token whose payload was tampered with", () => {
    const payload = {
      path: "/secret",
      locale: "uk",
      status: "draft",
      expires: Date.now() + 60_000,
      signature: "forged",
    };
    const token = Buffer.from(JSON.stringify(payload)).toString("base64url");

    assert.equal(
      verifyPreviewToken(token, { path: "/secret", locale: "uk" }, SECRET),
      false,
    );
  });

  it("rejects an expired token", () => {
    assert.equal(
      verifyPreviewToken(
        tokenFor({ expires: Date.now() - 1 }),
        { path: "/sets", locale: "uk" },
        SECRET,
      ),
      false,
    );
  });

  it("rejects a token issued for another path or locale", () => {
    assert.equal(
      verifyPreviewToken(tokenFor(), { path: "/other", locale: "uk" }, SECRET),
      false,
    );
    assert.equal(
      verifyPreviewToken(tokenFor(), { path: "/sets", locale: "en" }, SECRET),
      false,
    );
  });

  it("rejects every token when no secret is configured", () => {
    assert.equal(
      verifyPreviewToken(tokenFor(), { path: "/sets", locale: "uk" }, undefined),
      false,
    );
  });

  it("rejects malformed input instead of throwing", () => {
    assert.equal(
      verifyPreviewToken("not-a-token", { path: "/sets", locale: "uk" }, SECRET),
      false,
    );
  });
});
