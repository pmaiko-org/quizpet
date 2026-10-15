import { CMS_PREVIEW_COOKIE } from "../../utils/cms-preview";

export default defineEventHandler((event) => {
  deleteCookie(event, CMS_PREVIEW_COOKIE, { path: "/" });
  return sendRedirect(event, "/");
});
