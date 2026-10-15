import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { followRedirects } from "../app/core/cms/utils/redirects";

describe("followRedirects", () => {
  it("returns null when nothing matches", () => {
    assert.equal(
      followRedirects([{ from: "/a", to: "/b", statusCode: 301 }], "/c"),
      null,
    );
  });

  it("follows a single hop and keeps its status code", () => {
    assert.deepEqual(
      followRedirects([{ from: "/a", to: "/b", statusCode: 302 }], "/a"),
      { to: "/b", statusCode: 302 },
    );
  });

  it("collapses a chain and keeps the first status code", () => {
    assert.deepEqual(
      followRedirects(
        [
          { from: "/a", to: "/b", statusCode: 302 },
          { from: "/b", to: "/c", statusCode: 301 },
        ],
        "/a",
      ),
      { to: "/c", statusCode: 302 },
    );
  });

  it("stops before re-entering a visited path", () => {
    assert.deepEqual(
      followRedirects(
        [
          { from: "/a", to: "/b", statusCode: 301 },
          { from: "/b", to: "/a", statusCode: 301 },
        ],
        "/a",
      ),
      { to: "/b", statusCode: 301 },
    );
  });

  it("stops at the hop limit instead of looping forever", () => {
    const redirects = Array.from({ length: 30 }, (_, index) => ({
      from: `/p${index}`,
      to: `/p${index + 1}`,
      statusCode: 301 as const,
    }));

    assert.deepEqual(followRedirects(redirects, "/p0"), {
      to: "/p10",
      statusCode: 301,
    });
  });

  it("ignores a redirect that points at itself", () => {
    assert.equal(
      followRedirects([{ from: "/a", to: "/a", statusCode: 301 }], "/a"),
      null,
    );
  });
});
