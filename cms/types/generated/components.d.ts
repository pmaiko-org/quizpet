import type { Schema, Struct } from "@strapi/strapi";

export interface SharedFeatureItem extends Struct.ComponentSchema {
  collectionName: "components_shared_feature_items";
  info: {
    displayName: "Feature Item";
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<"global::icon">;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: "components_shared_links";
  info: {
    displayName: "Link";
  };
  attributes: {
    icon: Schema.Attribute.String &
      Schema.Attribute.CustomField<"global::icon">;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    page: Schema.Attribute.Relation<"oneToOne", "api::page.page">;
    url: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos";
  info: {
    displayName: "SEO";
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<"images">;
  };
}

export interface SharedSlideItem extends Struct.ComponentSchema {
  collectionName: "components_shared_slide_items";
  info: {
    displayName: "Slide Item";
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String;
    icon: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<"global::icon">;
    imageAlt: Schema.Attribute.String & Schema.Attribute.Required;
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WidgetsCalloutWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_callout_widgets";
  info: {
    displayName: "Callout Widget";
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    icon: Schema.Attribute.String &
      Schema.Attribute.CustomField<"global::icon">;
    primaryLink: Schema.Attribute.Component<"shared.link", false>;
    secondaryLink: Schema.Attribute.Component<"shared.link", false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ["info", "success", "warning", "error"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"info">;
  };
}

export interface WidgetsCreateSetWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_create_set_widgets";
  info: {
    displayName: "Create Set Widget";
  };
  attributes: {};
}

export interface WidgetsFeatureGridWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_feature_grid_widgets";
  info: {
    displayName: "Feature Grid Widget";
  };
  attributes: {
    anchor: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<"shared.feature-item", true> &
      Schema.Attribute.Required;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    tone: Schema.Attribute.Enumeration<["default", "tinted"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"default">;
    variant: Schema.Attribute.Enumeration<["cards", "steps"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"cards">;
  };
}

export interface WidgetsHeadingWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_heading_widgets";
  info: {
    displayName: "Heading Widget";
  };
  attributes: {
    align: Schema.Attribute.Enumeration<["left", "center"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"left">;
    eyebrow: Schema.Attribute.String;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WidgetsHeroWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_hero_widgets";
  info: {
    displayName: "Hero Widget";
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    imageAlt: Schema.Attribute.String & Schema.Attribute.Required;
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
    primaryLink: Schema.Attribute.Component<"shared.link", false>;
    secondaryLink: Schema.Attribute.Component<"shared.link", false>;
    summary: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WidgetsHomeWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_home_widgets";
  info: {
    displayName: "Home Widget";
  };
  attributes: {};
}

export interface WidgetsLearnWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_learn_widgets";
  info: {
    displayName: "Learn Widget";
  };
  attributes: {};
}

export interface WidgetsLoginWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_login_widgets";
  info: {
    displayName: "Login Widget";
  };
  attributes: {};
}

export interface WidgetsMatchWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_match_widgets";
  info: {
    displayName: "Match Widget";
  };
  attributes: {};
}

export interface WidgetsPeopleGridWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_people_grid_widgets";
  info: {
    displayName: "People Grid Widget";
  };
  attributes: {};
}

export interface WidgetsPeopleHeroWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_people_hero_widgets";
  info: {
    displayName: "People Hero Widget";
  };
  attributes: {};
}

export interface WidgetsPitanyachkaWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_pitanyachka_widgets";
  info: {
    displayName: "Pitanyachka Widget";
  };
  attributes: {};
}

export interface WidgetsProfileWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_profile_widgets";
  info: {
    displayName: "Profile Widget";
  };
  attributes: {};
}

export interface WidgetsRichTextWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_rich_text_widgets";
  info: {
    displayName: "Rich Text Widget";
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    width: Schema.Attribute.Enumeration<["narrow", "default", "full"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"default">;
  };
}

export interface WidgetsSetEditFormWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_set_edit_form_widgets";
  info: {
    displayName: "Set Edit Form Widget";
  };
  attributes: {};
}

export interface WidgetsSetsListWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_sets_list_widgets";
  info: {
    displayName: "Sets List Widget";
  };
  attributes: {};
}

export interface WidgetsSliderWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_slider_widgets";
  info: {
    displayName: "Slider Widget";
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String;
    slides: Schema.Attribute.Component<"shared.slide-item", true> &
      Schema.Attribute.Required;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WidgetsSpotlightWidget extends Struct.ComponentSchema {
  collectionName: "components_widgets_spotlight_widgets";
  info: {
    displayName: "Spotlight Widget";
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<["blue", "amber", "green"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"blue">;
    eyebrow: Schema.Attribute.String;
    imageAlt: Schema.Attribute.String & Schema.Attribute.Required;
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
    orientation: Schema.Attribute.Enumeration<["image-left", "image-right"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"image-left">;
    primaryLink: Schema.Attribute.Component<"shared.link", false>;
    summary: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module "@strapi/strapi" {
  export namespace Public {
    export interface ComponentSchemas {
      "shared.feature-item": SharedFeatureItem;
      "shared.link": SharedLink;
      "shared.seo": SharedSeo;
      "shared.slide-item": SharedSlideItem;
      "widgets.callout-widget": WidgetsCalloutWidget;
      "widgets.create-set-widget": WidgetsCreateSetWidget;
      "widgets.feature-grid-widget": WidgetsFeatureGridWidget;
      "widgets.heading-widget": WidgetsHeadingWidget;
      "widgets.hero-widget": WidgetsHeroWidget;
      "widgets.home-widget": WidgetsHomeWidget;
      "widgets.learn-widget": WidgetsLearnWidget;
      "widgets.login-widget": WidgetsLoginWidget;
      "widgets.match-widget": WidgetsMatchWidget;
      "widgets.people-grid-widget": WidgetsPeopleGridWidget;
      "widgets.people-hero-widget": WidgetsPeopleHeroWidget;
      "widgets.pitanyachka-widget": WidgetsPitanyachkaWidget;
      "widgets.profile-widget": WidgetsProfileWidget;
      "widgets.rich-text-widget": WidgetsRichTextWidget;
      "widgets.set-edit-form-widget": WidgetsSetEditFormWidget;
      "widgets.sets-list-widget": WidgetsSetsListWidget;
      "widgets.slider-widget": WidgetsSliderWidget;
      "widgets.spotlight-widget": WidgetsSpotlightWidget;
    }
  }
}
