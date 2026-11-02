"use strict";

const UNUSED_GLOBAL_KEYS = [
  "common.cards",
  "common.folders",
  "common.home",
  "common.language.en",
  "common.language.uk",
  "common.privacy",
  "common.smallSteps",
  "common.statistics",
  "landing.features",
  "landing.howItWorks",
  "landing.navigation",
];

const TRANSLATIONS_TABLE = "translations";
const COMPONENT_TRANSLATIONS_TABLE = "components_shared_translations";
const CREATE_SET_COMPONENTS_TABLE =
  "components_widgets_create_set_widgets_cmps";

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable(TRANSLATIONS_TABLE)) {
      await knex(TRANSLATIONS_TABLE).whereIn("key", UNUSED_GLOBAL_KEYS).del();
    }

    if (
      !(await knex.schema.hasTable(COMPONENT_TRANSLATIONS_TABLE)) ||
      !(await knex.schema.hasTable(CREATE_SET_COMPONENTS_TABLE))
    ) {
      return;
    }

    const translationIds = await knex(COMPONENT_TRANSLATIONS_TABLE)
      .join(
        CREATE_SET_COMPONENTS_TABLE,
        `${CREATE_SET_COMPONENTS_TABLE}.cmp_id`,
        `${COMPONENT_TRANSLATIONS_TABLE}.id`,
      )
      .where(`${CREATE_SET_COMPONENTS_TABLE}.component_type`, "shared.translation")
      .where(`${CREATE_SET_COMPONENTS_TABLE}.field`, "translations")
      .where(`${COMPONENT_TRANSLATIONS_TABLE}.key`, "form.loading")
      .pluck(`${COMPONENT_TRANSLATIONS_TABLE}.id`);

    if (!translationIds.length) {
      return;
    }

    await knex(CREATE_SET_COMPONENTS_TABLE)
      .whereIn("cmp_id", translationIds)
      .del();
    await knex(COMPONENT_TRANSLATIONS_TABLE)
      .whereIn("id", translationIds)
      .del();
  },

  async down() {
    throw new Error("Unused CMS translations cannot be restored automatically");
  },
};
