import { getCmsRedirects } from "../../utils/cms-cache";

export default defineEventHandler(event =>
  getCmsRedirects(useRuntimeConfig(event)),
);
