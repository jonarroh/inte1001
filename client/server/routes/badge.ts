import { Hono } from 'hono';

// import { zValidator } from '@hono/zod-validator';

// import { tennisDTO} from '../dto/tennisDTO';
import BadgeController, { UserBadges } from '../controller/badge';
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


badge.post('/', async (c) => {
  const body = await c.req.formData(); // Obtener el FormData
  console.log(body); // Imprime el contenido de FormData

  // Validar el FormData utilizando Zod
  const validate = badgeDTO.safeParse(Object.fromEntries(body.entries())); // Convertir FormData a objeto para Zod
  if (!validate.success) {
    return c.json({ error: validate.error.format() }, 400); // Usa format para obtener un formato más legible
  }

  const { name, description, pointsRequired, image } = validate.data;

  // Validar que la imagen sea un Blob y tenga un tipo MIME válido
  if (!image || !(image instanceof File)) {
    return c.json({ error: 'Invalid image file' }, 400);
  }

  // Aquí puedes verificar el tipo MIME si es necesario
  if (!image.type.startsWith('image/')) {
    return c.json({ error: 'El archivo debe ser una imagen válida (JPEG, PNG o JPG)' }, 400);
  }

  console.log(`Recibido archivo de imagen: ${image.name}, tamaño: ${image.size} bytes`);

  // Crear un objeto badge
  const badge = {
    name,
    description,
    pointsRequired: Number(pointsRequired),
  };

  const controller = new BadgeController();
  const result = await controller.insertBadge(badge);
  if (result.isOk) {
    console.log(result.value);
    // Subir la imagen al CDN
    if(result.value?.id){
      const uploadResult = await controller.sendToCDN(image, String(result.value.id));
      if (uploadResult.isOk) {
        console.log('Imagen subida a CDN:', uploadResult.value);
      } else {
        console.error('Error al subir imagen a CDN:', uploadResult.error);
      }
    }
    
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});

badge.put('/:id', async (c) => {
  const badgeId = c.req.param('id'); // Obtener el ID del badge desde los parámetros de la URL
  const body = await c.req.formData(); // Obtener el FormData
  console.log(body); // Imprime el contenido de FormData

  // Validar el FormData utilizando Zod
  const validate = badgeDTO.safeParse(Object.fromEntries(body.entries())); // Convertir FormData a objeto para Zod
  if (!validate.success) {
    return c.json({ error: validate.error.format() }, 400); // Usa format para obtener un formato más legible
  }

  const { name, description, pointsRequired, image } = validate.data;

  // Solo validar la imagen si está presente
  if (image && !(image instanceof File)) {
    return c.json({ error: 'Invalid image file' }, 400);
  }

  // Crear el objeto de actualización, incluyendo el ID
  const badgeUpdate = {
    id: Number(badgeId), 
    name,
    description,
    pointsRequired: Number(pointsRequired), 
  };

  const controller = new BadgeController();
  const result = await controller.updateBadge(badgeUpdate, Number(badgeId));
  if (result.isOk) {
    if (image && image.size > 0) {
      
      console.log(`Recibido archivo de imagen: ${image.name}, tamaño: ${image.size} bytes`);

      const uploadResult = await controller.sendToCDN(image, badgeId);

      if (uploadResult.isOk) {
        console.log('Imagen subida a CDN:', uploadResult.value);
      } else {
        console.error('Error al subir imagen a CDN:', uploadResult.error);
      }

    }

    return c.json(result.value);
    
  } else {
    return c.json({ error: result.error }, 500);
  }
});



badge.delete('/:id', async (c) => {
  const controller = new BadgeController();
  const id = c.req.param('id');
  // console.log("se borra",id)
  const result = await controller.deleteBadge(Number(id));
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


badge.get('/user/:id', async (c) => {
  const controller = new UserBadges();
  const id = c.req.param('id');
  const result = await controller.getUserBadges(Number(id));
  console.log("result",result);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


badge.post('/user/poinst', async (c) => {
  const controller = new UserBadges();
  const {userId} =await c.req.json();
  console.log(userId);
  const result = await controller.getUserPoints(Number(userId));
  console.log("result",result);
  if (result.isOk) {
    return c.json({
      points:result.value
    });
  } else {
    return c.json({ points: 0}, 200);
  }
}
);

badge.post('/poinst', async (c) => {
  console.log("entra");
  const controller = new UserBadges();
  const body = await c.req.json();
  console.log({body});
  const result = await controller.addUserPoints(body.userId,body.points);
  if (result.isOk) {
    return c.json(result.value);
  } else {
    return c.json({ error: result.error }, 500);
  }
});


export default badge;