import { Hono } from "hono";
import tennis from "./routes/tennis";
import { cors } from 'hono/cors'
import taco from "./routes/taco";
import auth from "./routes/auth";
import badge from "./routes/badge";
import leagues  from "./routes/leagues";

const app = new Hono();

app.use(cors(
  {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }
));
app.route('/tennis', tennis);
app.route('/taco', taco);
app.route('/auth', auth);
app.route('/badge', badge);
app.route('/leagues', leagues);
export default app;
