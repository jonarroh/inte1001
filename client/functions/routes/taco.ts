import { Hono } from "hono";
import { jwt } from 'hono/jwt';
import { roleMiddleware } from "../middleware/role.middleware";

const taco = new Hono();

taco.use('/*', jwt({
  secret: '4uT0M4t1cS0l-Th3-4uT0M4t1cS0l',
}));

taco.use('/*', roleMiddleware(['admin',"inventory"]));

taco.get('/', async (c) => {
  return c.json({ message: 'Hello World' });
});

export default taco;
