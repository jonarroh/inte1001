
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { tennisDTO} from '../dto/tennisDTO';
import LeagueController from '../controller/leagues';
import {leagueDTO } from '../dto/leagueDTO';

const league = new Hono();

league.get('/', async (c) => {
  const controller = new LeagueController();
  const result = await controller.getLeagues();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

league.get('/:id', async (c) => {
  const controller = new LeagueController();
  const id = c.req.param('id');
  const result = await controller.getLeagueById(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

league.post('/', zValidator('json', leagueDTO), async (c) => {
  const controller = new LeagueController();
  const validated = c.req.valid('json') ;
  const result = await controller.insertLeague(validated);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

league.put('/:id', zValidator('json', leagueDTO), async (c) => {
  const controller = new LeagueController();
  const id = c.req.param('id');
  const validated = c.req.valid('json');
  const result = await controller.updateLeague(validated, Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

league.delete('/:id', async (c) => {
  const controller = new LeagueController();
  const id = c.req.param('id');
  const result = await controller.deleteLeague(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


export default league;