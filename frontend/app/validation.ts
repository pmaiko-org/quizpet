import { z } from "zod";

export const fileSchema = z.object({
  id: z.string(),
  src: z.string(),
  name: z.string(),
});
