import { Hono } from "hono";

const tennis = new Hono().basePath('/taco');

tennis.get('/', async (c) => {
  return c.json({ message: 'Hello World' });
});

export default tennis;