import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { tennisDTO, Tennis} from '../dto/tennisDTO';

import TennisController from '../controller/tennis';
const tennis = new Hono();

tennis.get('/', async (c) => {
  const controller = new TennisController();
  const result = await controller.getTennis();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

tennis.get('/:id', async (c) => {
  const controller = new TennisController();
  const id = c.req.param('id');
  const result = await controller.getTennisById(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

tennis.post('/', zValidator('form', tennisDTO), async (c) => {
  const controller = new TennisController();
  const validated = c.req.valid('form') as Tennis;
  const result = await controller.insertTennis(validated);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

tennis.put('/:id', zValidator('form', tennisDTO), async (c) => {
  const controller = new TennisController();
  const id = c.req.param('id');
  const validated = c.req.valid('form') as Tennis;
  const result = await controller.updateTennis(validated, Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

tennis.delete('/:id', async (c) => {
  const controller = new TennisController();
  const id = c.req.param('id');
  const result = await controller.deleteTennis(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

export default tennis;
