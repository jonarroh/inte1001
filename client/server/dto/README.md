## carperta dto

En la carpeta `dto` se encuentran los siguientes archivos y directorios:

### 📑 `dto
Aquí se colocan los archivos de creación de tablas y los tipos de TypeScript (`.ts`):
- **`badgeDTO.ts`**: Archivo de donde se encuenta la validacion de los datos del endpoint `badge`.

### ejemplo 
```typescript
import {z} from "zod";


export const badgeDTO = z.object({
  name: z.string({
    message: "El nombre debe ser una cadena de texto",
  }).refine((value) => value.length > 0, {
    message: "El nombre no puede estar vacio",
  }),
  description: z.string({
    message: "La descripcion debe ser una cadena de texto",
  }).optional(),
  pointsRequired: z.number({
    message: "Los puntos requeridos deben ser un numero",
  }).refine((value) => value > 0, {
    message: "Los puntos requeridos deben ser mayor a 0",
  }),
});
```

### zod

zod es una libreria de validacion de datos en typescript, en este caso se esta validando que los datos del endpoint `badge` sean correctos.

### 📚 [Zod]()

con el z.object se esta creando un objeto con las validaciones de los datos que se reciben en el endpoint `badge`.

z.string se esta validando que el nombre y la descripcion sean de tipo string.

z.number se esta validando que los puntos requeridos sean de tipo numero.



