import type { AsyncComponentLoader, Component } from "vue";

import type { TCmsBlock } from "~/core/cms/types";

export interface ICmsWidgetDefinition {
  component: Component;
  frame: "contained" | "full";
}

const widget = (
  loader: AsyncComponentLoader,
  frame: ICmsWidgetDefinition["frame"] = "full",
): ICmsWidgetDefinition => ({
  component: defineAsyncComponent(loader),
  frame,
});

export const widgetRegistry = {
  "widgets.hero-widget": widget(() => import("../widgets/HeroWidget.vue")),
  "widgets.feature-grid-widget": widget(
    () => import("../widgets/FeatureGridWidget.vue"),
  ),
  "widgets.spotlight-widget": widget(
    () => import("../widgets/SpotlightWidget.vue"),
  ),
  "widgets.slider-widget": widget(() => import("../widgets/SliderWidget.vue")),
  "widgets.heading-widget": widget(
    () => import("../widgets/HeadingWidget.vue"),
    "contained",
  ),
  "widgets.rich-text-widget": widget(
    () => import("../widgets/RichTextWidget.vue"),
    "contained",
  ),
  "widgets.callout-widget": widget(
    () => import("../widgets/CalloutWidget.vue"),
    "contained",
  ),
  "widgets.home-widget": widget(() => import("../widgets/HomeWidget.vue")),
  "widgets.login-widget": widget(
    () => import("~/features/auth/widgets/LoginWidget.vue"),
  ),
  "widgets.people-hero-widget": widget(
    () => import("~/features/people/widgets/PeopleHeroWidget.vue"),
  ),
  "widgets.people-grid-widget": widget(
    () => import("~/features/people/widgets/PeopleGridWidget.vue"),
  ),
  "widgets.pitanyachka-widget": widget(
    () => import("~/features/pitanyachka/widgets/PitanyachkaWidget.vue"),
  ),
  "widgets.profile-widget": widget(
    () => import("~/features/profile/widgets/ProfileWidget.vue"),
  ),
  "widgets.sets-list-widget": widget(
    () => import("~/features/sets/widgets/SetsListWidget.vue"),
  ),
  "widgets.create-set-widget": widget(
    () => import("~/features/sets/widgets/CreateSetWidget.vue"),
  ),
  "widgets.set-edit-form-widget": widget(
    () => import("~/features/sets/widgets/SetEditFormWidget.vue"),
  ),
  "widgets.learn-widget": widget(
    () => import("~/features/sets/widgets/LearnWidget.vue"),
  ),
  "widgets.match-widget": widget(
    () => import("~/features/sets/widgets/MatchWidget.vue"),
  ),
} satisfies Record<TCmsBlock["__component"], ICmsWidgetDefinition>;

const registryByUid: Record<string, ICmsWidgetDefinition> = widgetRegistry;

export const findCmsWidget = (uid: string) => registryByUid[uid];
