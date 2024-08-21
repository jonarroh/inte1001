import { Hono } from "hono";
import tennis from "./routes/tennis";
import { cors } from 'hono/cors'
import taco from "./routes/taco";
import auth from "./routes/auth";


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
export default app;
