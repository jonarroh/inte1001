import {z} from "zod";

export const loginDTO = z.object({
  email: z.string(),
  password: z.string(),
});