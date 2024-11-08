import {z} from 'zod';


export const loggerDTO = z.object({
    message: z.string(),
    date: z.string(),
    origin: z.string(),
    from: z.string(),
});