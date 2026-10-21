import type { Data, UID } from "@strapi/types";

import type {} from "./components.generated";
import type {} from "./contentTypes.generated";

export type TCmsContentTypeUid = UID.ContentType;
export type TCmsComponentUid = UID.Component;

export type TCmsContentType<TUid extends TCmsContentTypeUid> =
  Data.ContentType<TUid>;

export type TCmsComponent<TUid extends TCmsComponentUid> = Data.Component<TUid>;

export type TCmsPageSchema = TCmsContentType<"api::page.page">;
export type TCmsPageSchemaBlock = NonNullable<TCmsPageSchema["blocks"]>[number];
