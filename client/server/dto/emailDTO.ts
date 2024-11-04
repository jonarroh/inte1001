import {z} from "zod";


export const emailDTO = z.object({
  to: z.string({
    message: "El destinatario debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El destinatario no puede estar vacio",
  }),
  subject: z.string({
    message: "El asunto debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El asunto no puede estar vacio",
  }),
  htmlBody: z.string({
    message: "El cuerpo del correo debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El cuerpo del correo no puede estar vacio",
  }),
});

export const sendToEmailDTO = z.object({
  message: z.string({
    message: "El mensaje debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El mensaje no puede estar vacio",
  }),
  framework: z.enum(["todos", "lessActivity", "MoreActivity"]),
});