import { Hono } from "hono";
import tennis from "./routes/tennis";
import tacos from "./routes/taco";
import { cors } from 'hono/cors'

const app = new Hono();

app.use(cors(
  {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }
));

app.route('/tennis', tennis);
export default app;
