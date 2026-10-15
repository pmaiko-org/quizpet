import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: "icon",
      type: "string",
      intlLabel: {
        id: "quizpet.icon.label",
        defaultMessage: "Icon",
      },
      intlDescription: {
        id: "quizpet.icon.description",
        defaultMessage: "Pick an icon from the Lucide set",
      },
      components: {
        Input: async () => import("./components/IconPickerInput"),
      },
    });
  },
};
