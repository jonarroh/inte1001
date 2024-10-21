## carpeta `routes`

En las carpetas `routes` se encuentran los siguientes archivos y directorios:
- **`badge.ts`**: Archivo de rutas para el recurso `badge`.
- **`auth.ts`**: Archivo de rutas para el recurso `auth`.
- **`user.ts`**: Archivo de rutas para el recurso `user`.


para la enrutacion de las apis se esta utilizado hono debido a ser un framework que facilita la creacion de apis, esta creado para ser utilizado como funciones serverless, por lo que se puede utilizar en cualquier proveedor de servicios cloud. Asi como su integracion con typescript y su facilidad para la creacion de middlewares.

## ejmplo

```typescript
import { Hono } from "hono";

const email = new Hono();

email.get("/email", async (c) => {
  return c.json({ message: "Hello World" });
});
```	

### uso de zValidator
zVALIDATOr es funcionalidad de zod que permite integrar las validaciones de los datos que se reciben en los endpoints, en este caso se esta utilizando para validar los datos del endpoint `badge`.

```typescript
email.post('/',zValidator('json',emailDTO), async (c) => {
  const validated = c.req.valid('json')
  const controller = new EmailController()

  const result = await controller.sendEmail(validated)

  if(result){
    return c.json({message:'Correo enviado correctamente'})
  }
  return c.json({message:'Error al enviar el correo'},500)
}
```

en caso de no cumplir con las validaciones se retornara un mensaje de error con el status 500. con la respuesta de la validacion se procede a enviar el correo.