
import { z } from "zod";

// Definimos el esquema para las "keys"
const keysSchema = z.object({
  auth: z.string({
    message: "El campo 'auth' debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El campo 'auth' no puede estar vacío",
  }),
  p256dh: z.string({
    message: "El campo 'p256dh' debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El campo 'p256dh' no puede estar vacío",
  }),
});

// Definimos el DTO principal para la suscripción
export const subscriptionDTO = z.object({
  endpoint: z.string({
    message: "El campo 'endpoint' debe ser una cadena de texto",
  }).url({
    message: "El campo 'endpoint' debe ser una URL válida",
  }),
  expirationTime: z.nullable(z.number().optional()), // Puede ser un número o nulo
  keys: keysSchema, // Validamos el campo 'keys' usando el esquema definido antes
});


export const messageDTO = z.object({
  title: z.string({
    message: "El campo 'title' debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El campo 'title' no puede estar vacío",
  }),
  message: z.string({
    message: "El campo 'message' debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El campo 'message' no puede estar vacío",
  }),
  url: z.string({
    message: "El campo 'url' debe ser una cadena de texto",
  }).url({
    message: "El campo 'url' debe ser una URL válida",
  }),
});