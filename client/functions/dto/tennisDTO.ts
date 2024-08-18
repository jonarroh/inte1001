import { z } from "zod";

export const tennisDTO = z.object({
  marca: z.string(),
  modelo: z.string(),
  precio: z.number(),
  stock: z.number(),
  descripcion: z.string(),
  imagen: z.string(),
});

export type Tennis = z.infer<typeof tennisDTO>;
