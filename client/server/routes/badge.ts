import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { tennisDTO} from '../dto/tennisDTO';
import BadgeController from '../controller/badge';
import { badgeDTO } from '../dto/badgeDTO';

const badge = new Hono();

badge.get('/', async (c) => {
  const controller = new BadgeController();
  const result = await controller.getBadges();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


badge.get('/:id', async (c) => {
  const controller = new BadgeController();
  const id = c.req.param('id');
  const result = await controller.getBadgeById(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


badge.post('/', zValidator('json', badgeDTO), async (c) => {
  const controller = new BadgeController();
  const validated = c.req.valid('json') ;
  const result = await controller.insertBadge({ ...validated, pointsRequired: Number(validated.pointsRequired) });
  if (result.isOk) {
    console.log(result.value);
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

badge.put('/:id', zValidator('form', badgeDTO), async (c) => {
  console.log("peticion recibida");

  const validated = c.req.valid('form');
  console.log('Datos validados:', validated);

  if (!validated) {
    return c.json({ error: 'Datos no válidos' }, 400);
  }

  const controller = new BadgeController();
  const id = c.req.param('id');
  console.log(validated);  
  const result = await controller.updateBadge({ ...validated, pointsRequired: Number(validated.pointsRequired) }, Number(id));

  if (result.isOk) {
    console.log(result.value);
    return c.json(result.value);
  } else {
    console.log(result.error);
    return c.json({ error: result.error }, 500);
  }
});


badge.delete('/:id', async (c) => {
  const controller = new BadgeController();
  const id = c.req.param('id');
  const result = await controller.deleteBadge(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

export default badge;