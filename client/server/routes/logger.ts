import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { loggerDTO } from '../dto/loggerDTO';
import LoggerController from '../controller/logger';


const logger = new Hono();

logger.post('/writeinfo',zValidator("json",loggerDTO), async (c) => {
  const controller = new LoggerController();

  const validated = c.req.valid('json');

  const log: { message: string; type: "info"; date: string, from: string, origin: string } = {
    ...validated,
    type: 'info'
  }

  const result = await controller.createLog(log);

  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

logger.post('/writeerror',zValidator("json",loggerDTO), async (c) => {
  const controller = new LoggerController();

  const validated = c.req.valid('json');

  const log: { message: string; type: "error"; date: string, from: string , origin: string } = {
    ...validated,
    type: 'error'
  }

  const result = await controller.createLog(log);

  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);


logger.get('/', async (c) => {
  const controller = new LoggerController();
  const result = await controller.getLogs();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

logger.post('/writewarning',zValidator("json",loggerDTO), async (c) => {
  const controller = new LoggerController();

  const validated = c.req.valid('json');

  const log: { message: string; type: "warning"; date: string, from: string, origin: string } = {
    ...validated,
    type: 'warning'
  }

  const result = await controller.createLog(log);

  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);


export default logger;