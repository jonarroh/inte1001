import { Hono } from "hono";
import { ExternalUserInteractionsController } from "../controller/external";
import { zValidator } from "@hono/zod-validator";
import { externalDTO } from "../dto/externalDTO";


const external = new Hono();

external.get('/', async (c) => {
  const controller = new ExternalUserInteractionsController();
  const result = await controller.getExternalUserInteractions();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

external.get('/grouped', async (c) => {
  const controller = new ExternalUserInteractionsController();
  const result = await controller.getMessagesGroupedByUser();
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

external.post('/',zValidator('json',externalDTO) ,async (c) => {
  const controller = new ExternalUserInteractionsController();
  const body = c.req.valid('json');
  const result = await controller.insert(body);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
}
);

export default external