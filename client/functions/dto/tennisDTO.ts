import { z } from "zod";

export const tennisDTO = z.object({
  marca: z.string({
    message: "La marca debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "La marca no puede estar vacia",
  }),
  modelo: z.string({
    message: "El modelo debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El modelo no puede estar vacio",
  }),
  precio: z.number({
    message: "El precio debe ser una cadena de texto",
  }).refine((value) => value > 0, {
    message: "El precio debe ser mayor a 0",
  }),
  descripcion: z.string({
    message: "La descripcion debe ser una cadena de texto",
  }).optional(),
  imagen: z.string({
    message: "La imagen debe ser una cadena de texto",
  }).optional(),
});
