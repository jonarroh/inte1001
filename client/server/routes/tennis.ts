import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { tennisDTO} from '../dto/tennisDTO';

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


//el zValidator es un middleware que se encarga de validar los datos que se envian en el body
// y obtiene el resultado de la validacion con c.req.valid('json')
tennis.post('/', zValidator('json', tennisDTO), async (c) => {
  const controller = new TennisController();
  const validated = c.req.valid('json') ;
  const result = await controller.insertTennis(validated);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

tennis.put('/:id', zValidator('json', tennisDTO), async (c) => {
  const controller = new TennisController();
  const id = c.req.param('id');
  console.log(id);
  const validated = c.req.valid('json');
  const result = await controller.updateTennis(validated, Number(id));
  if (result.isOk) {
    console.log(result.value);
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
