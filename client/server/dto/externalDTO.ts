
import { z } from 'zod';

export const externalDTO = z.object({
  id: z.number({
    message: 'El id debe ser un numero',
  }).int().optional(),
  userId: z.number({
    message: 'El id del usuario debe ser un numero',
  }).int(),
  interactionType: z.enum(['email', 'sms', 'whatsapp']),
  interactionData: z.string({
    message: 'Los datos de la interaccion deben ser una cadena de texto',
  }).optional(),
  subject: z.string({
    message: 'El asunto debe ser una cadena de texto',
  }).optional(),
  interactionAt: z.string({
    message: 'La fecha de la interaccion debe ser una cadena de texto',
  }).optional(),
});