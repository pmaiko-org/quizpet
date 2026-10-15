import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const PAGE_UID = "api::page.page";
const REDIRECT_UID = "api::redirect.redirect";
const MAX_REDIRECT_HOPS = 10;

type TDocumentContext = {
  uid: string;
  action: string;
  params: {
    documentId?: string;
    locale?: string;
    data?: Record<string, unknown>;
  };
};

const pathParams = (path: string) =>
  new Set(
    [...path.matchAll(/:([A-Za-z][A-Za-z0-9]*)/g)].map((match) => match[1]!),
  );

export const pageContractErrors = (page: {
  routeName: string;
  path: string;
  parentPath?: string | null;
}) => {
  if (!page.parentPath) {
    return [];
  }

  const own = pathParams(page.path);
  const missing = [...pathParams(page.parentPath)].filter(
    (name) => !own.has(name),
  );

  return missing.length
    ? [
        `Page "${page.routeName}" is missing parent path params: ${missing.join(", ")}`,
      ]
    : [];
};

const validatePage = async (strapi: Core.Strapi, ctx: TDocumentContext) => {
  const path = ctx.params.data?.path;

  if (typeof path !== "string" || !ctx.params.locale) {
    return;
  }

  const siblings = (await strapi.documents(PAGE_UID).findMany({
    locale: ctx.params.locale,
    status: "draft",
    filters: { path },
    fields: ["path", "routeName"],
  })) as unknown as { documentId: string; routeName: string }[];

  const clash = siblings.find(
    (item) => item.documentId !== ctx.params.documentId,
  );

  if (clash) {
    throw new errors.ApplicationError(
      `Path "${path}" is already used by page "${clash.routeName}" in locale ${ctx.params.locale}`,
    );
  }
};

export const redirectChainError = (
  links: Map<string, string>,
  start: string,
): string | null => {
  const chain = [start];
  let current = start;

  for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop += 1) {
    const next = links.get(current);

    if (!next) {
      return null;
    }
    if (chain.includes(next)) {
      return `Redirect loop: ${[...chain, next].join(" → ")}`;
    }

    chain.push(next);
    current = next;
  }

  return `Redirect chain from "${start}" is longer than ${MAX_REDIRECT_HOPS} hops`;
};

const validateRedirect = async (strapi: Core.Strapi, ctx: TDocumentContext) => {
  const existing = ctx.params.documentId
    ? ((await strapi.documents(REDIRECT_UID).findOne({
        documentId: ctx.params.documentId,
        fields: ["from", "to"],
      })) as unknown as { from: string; to: string } | null)
    : null;

  const from = String(ctx.params.data?.from ?? existing?.from ?? "");
  const to = String(ctx.params.data?.to ?? existing?.to ?? "");

  if (!from || !to) {
    return;
  }

  if (from === to) {
    throw new errors.ApplicationError(
      `Redirect "${from}" points to itself`,
    );
  }

  const all = (await strapi.documents(REDIRECT_UID).findMany({
    fields: ["from", "to"],
    limit: -1,
  })) as unknown as { documentId: string; from: string; to: string }[];

  const links = new Map(
    all
      .filter((item) => item.documentId !== ctx.params.documentId)
      .map((item) => [item.from, item.to] as const),
  );
  links.set(from, to);

  const error = redirectChainError(links, from);

  if (error) {
    throw new errors.ApplicationError(error);
  }
};

export const registerContentValidation = (strapi: Core.Strapi) => {
  strapi.documents.use(async (context, next) => {
    const ctx = context as unknown as TDocumentContext;

    if (ctx.action === "create" || ctx.action === "update") {
      if (ctx.uid === PAGE_UID) {
        await validatePage(strapi, ctx);
      }
      if (ctx.uid === REDIRECT_UID) {
        await validateRedirect(strapi, ctx);
      }
    }

    return next();
  });
};
