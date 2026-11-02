import { z } from "zod";

import { fileSchema } from "~/shared/validation";

export const createProfileSchema = (translate: (key: string) => string) =>
  z.object({
    firstName: z.string().trim().min(1, translate("validation.firstName")),
    lastName: z.string().trim().min(1, translate("validation.lastName")),
    avatar: fileSchema.optional(),
  });
