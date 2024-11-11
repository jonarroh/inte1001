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
  browser: z.string({
    message: "El browser debe ser una cadena de texto",
  }),
  deviceType: z.string({
    message: "El deviceType debe ser una cadena de texto",
  }),
});


export const lotationDateDTO = z.object({
  date: z.enum(["today", "yesterday", "lastWeek", "lastMonth", "lastYear"], {
    message: "La fecha debe ser today, yesterday, lastWeek, lastMonth o lastYear",
  }),
});