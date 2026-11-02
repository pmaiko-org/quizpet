import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  globalTranslationGroups,
  widgetTranslationValues,
  widgetTranslations,
} from "../scripts/seed/translations";

describe("widgetTranslations", () => {
  it("removes the widget prefix from local message keys", () => {
    const messages = widgetTranslations("widgets.home-widget", "en");

    assert.equal(
      messages.find(({ key }) => key === "title.default")?.value,
      "Ready for a short learning sprint?",
    );
    assert.equal(
      messages.some(({ key }) => key.startsWith("home.")),
      false,
    );
  });

  it("selects only messages owned by the widget", () => {
    const messages = widgetTranslations("widgets.people-hero-widget", "uk");

    assert.deepEqual(messages.map(({ key }) => key).sort(), [
      "description",
      "eyebrow",
      "title",
    ]);
  });
});

describe("translation ownership", () => {
  it("stores widget messages under their widget without global prefixes", () => {
    assert.equal(
      widgetTranslationValues["widgets.profile-widget"]?.en.title,
      "Your profile",
    );
    assert.equal(globalTranslationGroups.common["profile.title"], undefined);
  });

  it("keeps shared messages global", () => {
    assert.equal(globalTranslationGroups.common.cancel?.en, "Cancel");
    assert.equal(
      globalTranslationGroups.filePicker.title?.uk,
      "Вибір зображення",
    );
  });

  it("keeps editor loading copy only in the edit widget", () => {
    assert.equal(
      widgetTranslationValues["widgets.create-set-widget"]?.en[
        "form.loading"
      ],
      undefined,
    );
    assert.equal(
      widgetTranslationValues["widgets.set-edit-form-widget"]?.en[
        "form.loading"
      ],
      "Loading set editor",
    );
  });
});
