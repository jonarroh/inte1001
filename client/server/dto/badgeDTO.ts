import { z } from "zod";

export const badgeDTO = z.object({
  name: z.string({
    message: "El nombre debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El nombre no puede estar vacio",
  }),
  description: z.string({
    message: "La descripcion debe ser una cadena de texto",
  }).optional(),
  pointsRequired: z.string({
    message: "Los puntos requeridos deben ser un numero",
  }).refine((value) => !isNaN(Number(value)), {
    message: "Los puntos requeridos deben ser un numero",
  }),
  image: z
    .any()
    .refine((file:File) => file instanceof File, {
      message: "Debe ser un archivo",
    })
    .refine((file:File) => file.type.startsWith("image/"), {
      message: "Debe ser una imagen",
    })
    .optional(),
});
