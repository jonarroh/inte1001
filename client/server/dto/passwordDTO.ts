import { z } from "zod";
export const ChangePasswordDTO = z.object({
  email: z.string({
    message: "El correo electrónico debe ser una cadena de texto",
  }).email({
    message: "El correo electrónico debe ser válido",
  }),
  newPassword: z.string({
    message: "La nueva contraseña debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "La nueva contraseña no puede estar vacía",
  }).refine((value) => value.length >= 8, {
    message: "La nueva contraseña debe tener al menos 8 caracteres",
  }),
  code: z.string({
    message: "El código de recuperación debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El código de recuperación no puede estar vacío",
  }),
});


export const createPasswordRecoveryDTO = z.object({
  email: z.string({
    message: "El correo electrónico debe ser una cadena de texto",
  }).email({
    message: "El correo electrónico debe ser válido",
  }),
});