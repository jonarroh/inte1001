
import { z } from "zod";

export const carritoDTO = z.object({
    userId: z.number({
        message: "El userId debe ser un numero",
    }),
    productos: z.string({
        message: "Los productos deben ser un string",
    }),
    fecha: z.string({
        message: "La fecha debe ser un string",
    }),
    email: z.string({
        message: "El email debe ser un string",
    }),
    });