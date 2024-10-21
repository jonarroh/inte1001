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
  PUBLIC_WEB_PUSH_KEY: env.get('PUBLIC_WEB_PUSH_KEY').required().asString(),
  PRIVATE_WEB_PUSH_KEY: env.get('PRIVATE_WEB_PUSH_KEY').required().asString(),
};
