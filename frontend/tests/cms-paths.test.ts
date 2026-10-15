import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { localizeCmsPath, splitCmsPath } from "../server/utils/cms-paths";

const locales = [
  { code: "uk", name: "Ukrainian", isDefault: true },
  { code: "en", name: "English", isDefault: false },
];

describe("splitCmsPath", () => {
  it("treats an unprefixed path as the default locale", () => {
    assert.deepEqual(splitCmsPath(locales, "/sets"), {
      locale: "uk",
      path: "/sets",
    });
  });

  it("strips the prefix of a secondary locale", () => {
    assert.deepEqual(splitCmsPath(locales, "/en/sets"), {
      locale: "en",
      path: "/sets",
    });
  });

  it("maps a bare locale prefix to the root path", () => {
    assert.deepEqual(splitCmsPath(locales, "/en"), {
      locale: "en",
      path: "/",
    });
  });

  it("does not treat a lookalike segment as a locale prefix", () => {
    assert.deepEqual(splitCmsPath(locales, "/english/sets"), {
      locale: "uk",
      path: "/english/sets",
    });
  });

  it("throws when no locale is configured", () => {
    assert.throws(
      () => splitCmsPath([], "/sets"),
      /CMS locales are unavailable/,
    );
  });
});

describe("localizeCmsPath", () => {
  it("keeps the default locale unprefixed", () => {
    assert.equal(localizeCmsPath(locales, "/sets", "uk"), "/sets");
  });

  it("prefixes a secondary locale", () => {
    assert.equal(localizeCmsPath(locales, "/sets", "en"), "/en/sets");
  });

  it("keeps the root path clean in both locales", () => {
    assert.equal(localizeCmsPath(locales, "/", "uk"), "/");
    assert.equal(localizeCmsPath(locales, "/", "en"), "/en");
  });

  it("falls back to no prefix for an unknown locale", () => {
    assert.equal(localizeCmsPath(locales, "/sets", "de"), "/sets");
  });

  it("round-trips with splitCmsPath", () => {
    for (const path of ["/", "/sets", "/cabinet/sets/7/learn"]) {
      for (const locale of ["uk", "en"]) {
        assert.deepEqual(
          splitCmsPath(locales, localizeCmsPath(locales, path, locale)),
          { locale, path },
        );
      }
    }
  });
});
