import { z } from "zod";

import { fileSchema } from "~/shared/validation";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Вкажіть ім'я"),
  lastName: z.string().trim().min(1, "Вкажіть прізвище"),
  avatar: fileSchema.optional(),
});
