import {z} from "zod";


export const badgeDTO = z.object({
  name: z.string({
    message: "El nombre debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El nombre no puede estar vacio",
  }),
  description: z.string({
    message: "La descripcion debe ser una cadena de texto",
  }).optional(),
  pointsRequired: z.number({
    message: "Los puntos requeridos deben ser un numero",
  }).refine((value) => value > 0, {
    message: "Los puntos requeridos deben ser mayor a 0",
  }),
  image: z.any().optional(),

});