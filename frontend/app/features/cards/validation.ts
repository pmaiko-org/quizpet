import { z } from "zod";
import { fileSchema } from "~/validation";

export const optionalHexColor = z.preprocess(
  value => (typeof value === "string" && !value.trim() ? undefined : value),
  z
    .string()
    .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .optional(),
);

export const cardSchema = z.object({
  position: z.number(),
  term: z.string().trim().min(1),
  termDescription: z.string().trim().min(1).or(z.literal("")).optional(),
  termImage: fileSchema.optional(),
  definition: z.string().trim().min(1),
  definitionImage: fileSchema.optional(),
  textColor: optionalHexColor,
  backgroundColor: optionalHexColor,
});

export const setSchema = z.object({
  name: z.string().trim().min(2),
  topicIds: z.array(z.string().trim().min(1)).min(1),
  description: z.string().trim().max(280),
  cards: z.array(cardSchema).min(2),
});
