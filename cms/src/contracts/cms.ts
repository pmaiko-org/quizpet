import { z } from "zod";

export const cmsLocaleSchema = z.string().min(2);

export const cmsLocaleSettingSchema = z.object({
  code: cmsLocaleSchema,
  name: z.string(),
  isDefault: z.boolean(),
});

export const cmsMediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullable().optional(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
  })
  .nullable();

export const cmsSeoSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  ogImage: cmsMediaSchema.optional(),
  canonicalUrl: z.string().nullable().optional(),
  noIndex: z.boolean(),
});

export const cmsLinkSchema = z.object({
  label: z.string(),
  path: z.string(),
  isExternal: z.boolean(),
  icon: z.string().nullable().optional(),
});

const blocksBodySchema = z.array(z.record(z.string(), z.unknown()));

const heroWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.hero-widget"),
  eyebrow: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string(),
  imageUrl: z.string(),
  imageAlt: z.string(),
  primaryLink: cmsLinkSchema.nullable().optional(),
  secondaryLink: cmsLinkSchema.nullable().optional(),
});

const featureGridWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.feature-grid-widget"),
  eyebrow: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  anchor: z.string().nullable().optional(),
  items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      icon: z.string(),
    }),
  ),
  variant: z.enum(["cards", "steps"]),
  tone: z.enum(["default", "tinted"]),
});

const spotlightWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.spotlight-widget"),
  eyebrow: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string(),
  imageUrl: z.string(),
  imageAlt: z.string(),
  orientation: z.enum(["image-left", "image-right"]),
  accent: z.enum(["blue", "amber", "green"]),
  primaryLink: cmsLinkSchema.nullable().optional(),
});

const sliderWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.slider-widget"),
  eyebrow: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  slides: z.array(
    z.object({
      id: z.number(),
      eyebrow: z.string().nullable().optional(),
      title: z.string(),
      description: z.string(),
      imageUrl: z.string(),
      imageAlt: z.string(),
      icon: z.string(),
    }),
  ),
  autoplay: z.boolean(),
});

const headingWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.heading-widget"),
  eyebrow: z.string().nullable().optional(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  align: z.enum(["left", "center"]),
});

const richTextWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.rich-text-widget"),
  body: blocksBodySchema,
  width: z.enum(["narrow", "default", "full"]),
});

const calloutWidgetSchema = z.object({
  id: z.number(),
  __component: z.literal("widgets.callout-widget"),
  title: z.string(),
  body: blocksBodySchema,
  variant: z.enum(["info", "success", "warning", "error"]),
  icon: z.string().nullable().optional(),
  primaryLink: cmsLinkSchema.nullable().optional(),
  secondaryLink: cmsLinkSchema.nullable().optional(),
});

const functionalWidgetSchema = z.discriminatedUnion("__component", [
  z.object({ id: z.number(), __component: z.literal("widgets.home-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.login-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.people-hero-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.people-grid-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.pitanyachka-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.profile-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.sets-list-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.create-set-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.set-edit-form-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.learn-widget") }),
  z.object({ id: z.number(), __component: z.literal("widgets.match-widget") }),
]);

export const cmsBlockSchema = z.union([
  heroWidgetSchema,
  featureGridWidgetSchema,
  spotlightWidgetSchema,
  sliderWidgetSchema,
  headingWidgetSchema,
  richTextWidgetSchema,
  calloutWidgetSchema,
  functionalWidgetSchema,
]);

export const cmsBootstrapRequestSchema = z.object({
  locale: cmsLocaleSchema.optional(),
});

export const cmsBootstrapResponseSchema = z.object({
  locale: cmsLocaleSchema,
  locales: z.array(cmsLocaleSettingSchema),
  translations: z.record(z.string(), z.string()),
  routes: z.array(
    z.object({
      routeName: z.string(),
      path: z.string(),
      access: z.enum(["public", "authenticated", "guestOnly"]),
      noIndex: z.boolean(),
    }),
  ),
  global: z.object({
    siteName: z.string(),
    defaultSeo: cmsSeoSchema,
    logo: cmsMediaSchema.optional(),
    favicon: cmsMediaSchema.optional(),
    sidebarLinks: z.array(cmsLinkSchema),
    footerLinks: z.array(cmsLinkSchema),
    socialLinks: z.array(cmsLinkSchema),
    footerTagline: z.string().nullable().optional(),
  }),
});

export const cmsPageResolveRequestSchema = z.object({
  path: z.string().startsWith("/"),
  locale: cmsLocaleSchema.optional(),
  status: z.enum(["published", "draft"]).default("published"),
});

export const cmsPageResolveResponseSchema = z.object({
  page: z.object({
    routeName: z.string(),
    title: z.string(),
    layout: z.enum(["default", "landing", "cabinet", "empty"]),
    access: z.enum(["public", "authenticated", "guestOnly"]),
    redirectTo: z.string().nullable(),
    showBreadcrumbs: z.boolean(),
    seo: cmsSeoSchema,
    breadcrumbs: z.array(z.object({ title: z.string(), path: z.string() })),
    blocks: z.array(cmsBlockSchema),
    alternates: z.partialRecord(cmsLocaleSchema, z.string()),
  }),
  params: z.record(z.string(), z.string()),
});

export const cmsRedirectsResponseSchema = z.array(
  z.object({
    from: z.string(),
    to: z.string(),
    statusCode: z.union([z.literal(301), z.literal(302)]),
  }),
);

export type TCmsLocale = z.infer<typeof cmsLocaleSchema>;
export type TCmsLocaleSetting = z.infer<typeof cmsLocaleSettingSchema>;
export type TCmsBootstrapResponse = z.infer<typeof cmsBootstrapResponseSchema>;
export type TCmsPageResolveResponse = z.infer<typeof cmsPageResolveResponseSchema>;
export type TCmsRedirectsResponse = z.infer<typeof cmsRedirectsResponseSchema>;
