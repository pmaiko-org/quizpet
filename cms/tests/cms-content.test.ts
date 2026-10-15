import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  fillParams,
  findPage,
  matchPath,
  publicPath,
} from "../src/utils/cms-content";
import { pageContractErrors, redirectChainError } from "../src/utils/cms-validation";

const page = (routeName: string, path: string, priority = 0) =>
  ({ routeName, path, priority }) as never;

describe("matchPath", () => {
  it("captures params from a pattern", () => {
    assert.deepEqual(matchPath("/sets/:id/learn", "/sets/42/learn"), { id: "42" });
  });

  it("rejects a different segment count", () => {
    assert.equal(matchPath("/sets/:id", "/sets/42/learn"), null);
  });

  it("rejects a different static segment", () => {
    assert.equal(matchPath("/sets/:id", "/folders/42"), null);
  });

  it("decodes an encoded segment", () => {
    assert.deepEqual(matchPath("/sets/:id", "/sets/a%20b"), { id: "a b" });
  });

  it("rejects a malformed percent-encoded segment instead of throwing", () => {
    assert.equal(matchPath("/sets/:id", "/sets/%"), null);
    assert.equal(matchPath("/sets/:id", "/sets/%E0"), null);
  });
});

describe("fillParams", () => {
  it("substitutes and encodes a value", () => {
    assert.equal(fillParams("/sets/:id/learn", { id: "a b" }), "/sets/a%20b/learn");
  });

  it("keeps the placeholder when the param is missing", () => {
    assert.equal(fillParams("/sets/:id/learn", {}), "/sets/:id/learn");
  });
});

describe("findPage", () => {
  const pages = [
    page("sets", "/sets"),
    page("sets-id", "/sets/:id"),
    page("sets-id-learn", "/sets/:id/learn"),
    page("catch-all", "/sets/:id/:mode"),
  ];

  it("prefers an exact static match", () => {
    assert.equal(findPage(pages, "/sets")?.page.routeName, "sets");
  });

  it("prefers the pattern with more static segments", () => {
    assert.equal(findPage(pages, "/sets/7/learn")?.page.routeName, "sets-id-learn");
  });

  it("falls back to the looser pattern", () => {
    assert.equal(findPage(pages, "/sets/7/match")?.page.routeName, "catch-all");
  });

  it("returns undefined when nothing matches", () => {
    assert.equal(findPage(pages, "/unknown/deep/path"), undefined);
  });
});

describe("publicPath", () => {
  it("keeps the default locale unprefixed", () => {
    assert.equal(publicPath("uk", "/sets", "uk"), "/sets");
  });

  it("prefixes a secondary locale", () => {
    assert.equal(publicPath("en", "/sets", "uk"), "/en/sets");
  });

  it("keeps the root path clean", () => {
    assert.equal(publicPath("en", "/", "uk"), "/en");
    assert.equal(publicPath("uk", "/", "uk"), "/");
  });
});

describe("pageContractErrors", () => {
  it("accepts a child that carries every parent param", () => {
    assert.deepEqual(
      pageContractErrors({
        routeName: "sets-id-learn",
        path: "/sets/:id/learn",
        parentPath: "/sets/:id",
      }),
      [],
    );
  });

  it("reports params the child drops", () => {
    const errors = pageContractErrors({
      routeName: "sets-learn",
      path: "/sets/learn",
      parentPath: "/sets/:id",
    });

    assert.equal(errors.length, 1);
    assert.match(errors[0]!, /missing parent path params: id/);
  });
});

describe("redirectChainError", () => {
  it("accepts a finite chain", () => {
    const links = new Map([
      ["/a", "/b"],
      ["/b", "/c"],
    ]);

    assert.equal(redirectChainError(links, "/a"), null);
  });

  it("reports a loop", () => {
    const links = new Map([
      ["/a", "/b"],
      ["/b", "/a"],
    ]);

    assert.match(String(redirectChainError(links, "/a")), /Redirect loop/);
  });

  it("reports a chain longer than the hop limit", () => {
    const links = new Map(
      Array.from({ length: 15 }, (_, index) => [`/p${index}`, `/p${index + 1}`]),
    );

    assert.match(String(redirectChainError(links, "/p0")), /longer than 10 hops/);
  });
});
