## 🕹️ Controlador (`controller`)

La carpeta de controladores debe contener archivos con clases que manejen la lógica de negocio de cada entidad.

### 🎾 Ejemplo: `TennisController.ts`

```typescript
export default class TennisController {
  async getTennis(): Promise<Result<selectTennis[], string>> {
    return await db.getTennis();
  }

  async getTennisById(id: number): Promise<Result<selectTennis, string>> {
    return await db.getTennisById(id);
  }

  async createTennis(tennis: selectTennis): Promise<Result<number, string>> {
    return await db.createTennis(tennis);
  }

  async updateTennis(tennis: selectTennis): Promise<Result<number, string>> {
    return await db.updateTennis(tennis);
  }
}
```

## 🔄 Introducción al Patrón Result-Error

El patrón Result-Error es una forma de manejar errores de manera más limpia y legible. En lugar de lanzar excepciones, se retorna un objeto que contiene:
- Un booleano (`isOk`) que indica si la operación fue exitosa o no.
- Un valor (`value`) que contiene el resultado de la operación.
- Un error (`error`) que ocurrió durante la ejecución de la operación.

### 📜 Definición del Patrón Result-Error

```typescript
export interface Result<T, Err> {
  isOk: boolean;
  value?: T;
  error?: Err;
}
```

### 🛠️ Ejemplo de Uso

```typescript
async getTennis(): Promise<Result<selectTennis[], string>> {
  try {
    const result = await db.select().from(schema.tennis);
    return { isOk: true, value: result };
  } catch (error) {
    return { isOk: false, error: 'Failed to fetch tennis records' };
  }
}
```

En este ejemplo, se intenta obtener todos los registros de la tabla `tennis`. Si la operación es exitosa, se retorna un objeto con la propiedad `isOk` en `true` y el valor de la operación en la propiedad `value`. Si la operación falla, se retorna un objeto con la propiedad `isOk` en `false` y un mensaje de error en la propiedad `error`.

## 📖 Lectura de Types Complicados

A veces se generan types como `Promise<Result<selectTennis, string>>`. Aquí se explica cómo leer esto:

- `Promise`: Indica una operación asíncrona que se ejecutará en el futuro.
- `Result<selectTennis, string>`: Es un objeto que contiene un booleano (`isOk`) que indica si la operación fue exitosa o no, y un valor que contiene el resultado de la operación o un error que ocurrió durante la ejecución de la operación.
- `selectTennis`: Es un tipo que contiene la estructura de la tabla `tennis`. Este es un valor genérico que puede ser cualquier tipo de dato.
- `string`: Es un tipo que contiene un string. Este es un valor genérico que puede ser cualquier tipo de dato.

Con esta estructura, puedes manejar de manera efectiva y limpia los errores en tus operaciones asíncronas y entender mejor los tipos complejos en TypeScript. 🚀