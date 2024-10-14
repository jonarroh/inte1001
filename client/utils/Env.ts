import { from } from 'env-var';
import dotenv from 'dotenv';

// Cargar las variables desde el archivo .env
dotenv.config({ path: '.client/.env' });

//@ts-ignore
const env = from(process.env);

export const ENVS = {
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_USER: env.get('MAILER_USER').required().asString(),
  MAILER_PASS: env.get('MAILER_PASS').required().asString(),
};
