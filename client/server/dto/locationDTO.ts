import {z} from "zod";

export const locationDTO = z.object({
  latitude: z.number({
    message: "La latitud debe ser un numero",
  }),
  longitude: z.number({
    message: "La longitud debe ser un numero",
  }),
  isLogged: z.number({
    message: "isLogged debe ser un numero",
  }),
  token: z.string({
    message: "El token debe ser una cadena de texto",
  }),
});