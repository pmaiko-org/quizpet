import type {
  TCmsBootstrapResponse as TGeneratedCmsBootstrapResponse,
  TCmsPageResolveResponse as TGeneratedCmsPageResolveResponse,
  TCmsRedirectsResponse as TGeneratedCmsRedirectsResponse,
} from "./types/api.generated";

export type TCmsBootstrapResponse = TGeneratedCmsBootstrapResponse;
export type TCmsPageResolveResponse = TGeneratedCmsPageResolveResponse;
export type TCmsLocale = TCmsBootstrapResponse["locale"];
export type TCmsLocaleSetting = TCmsBootstrapResponse["locales"][number];
export type TCmsAccess = TCmsBootstrapResponse["routes"][number]["access"];
export type TCmsLayout = TCmsPageResolveResponse["page"]["layout"];
export type TCmsMedia = TCmsBootstrapResponse["global"]["logo"];
export type TCmsSeo = TCmsPageResolveResponse["page"]["seo"];
export type TCmsLink = TCmsBootstrapResponse["global"]["sidebarLinks"][number];

export type TCmsTextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type TCmsBlocksNode = {
  type:
    | "paragraph" |
    "heading" |
    "list" |
    "list-item" |
    "quote" |
    "code" |
    "link";
  level?: number;
  format?: "ordered" | "unordered";
  url?: string;
  children?: Array<TCmsBlocksNode | TCmsTextNode>;
};

export type TCmsBlock = TCmsPageResolveResponse["page"]["blocks"][number];
export type TCmsRoute = TCmsBootstrapResponse["routes"][number];
export type TCmsRedirect = TGeneratedCmsRedirectsResponse[number];
