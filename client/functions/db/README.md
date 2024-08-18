## 📂 Carpeta `db`

En la carpeta `db` se encuentran los siguientes archivos y directorios:

### 📑 `schema`
Aquí se colocan los archivos de creación de tablas y los tipos de TypeScript (`.ts`):
- **`review.sql`**: Archivo de creación de la tabla `review`.
- **`index.ts`**: Archivo de barril que se usa para hacer la migración a la base de datos. ⚠️ **Nota**: Si no se importan los datos de la base de datos en este archivo, ¡las tablas no se crearán!

### 🌱 `seed.ts`
Archivo de semilla para la base de datos, utilizado para poblarla con datos iniciales.

### 🔌 `index.ts`
Aquí se exporta la conexión a la base de datos.

## ℹ️ Información Extra

- 📚 [Joins](https://orm.drizzle.team/docs/joins)
- 📚 [Column Types](https://orm.drizzle.team/docs/column-types/sqlite)
- 📚 [Select](https://orm.drizzle.team/docs/select)
- 📚 [Update](https://orm.drizzle.team/docs/update)
- 📚 [Insert](https://orm.drizzle.team/docs/insert)
- 📚 [Delete](https://orm.drizzle.team/docs/delete)
- 📚 [Filter](https://orm.drizzle.team/docs/operators)

## 🛠️ Definición Básica de una Tabla con Drizzle

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

const tennis = sqliteTable("tennis", {
  id: integer('id').primaryKey(),
  marca: text('marca').notNull(),
  modelo: text('modelo').notNull(),
  precio: real('precio').notNull(),
  descripcion: text('descripcion'),
  imagen: text('imagen'),
});

export default tennis;
```

### 🗄️ Definir una Tabla con Llave Foránea

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import tennis from "./tennis"; // Importa la tabla a la que se le hará la llave foránea

const review = sqliteTable("review", {
  id: integer('id').primaryKey(),
  id_tennis: integer('id_tennis').notNull().foreignKey(tennis.id), // Agrega la llave foránea
  calificacion: integer('calificacion').notNull(),
  comentario: text('comentario'),
});

export default review;
```

## 🔍 Consultas para Obtener `tennis` con sus `reviews`

```typescript
import * as schema from "./schema"; // Importa las tablas
import db from "./index"; // Importa la conexión a la base de datos

const result = await db.select()
  .from(schema.tennis)
  .join(schema.review, eq(schema.tennis.id, schema.review.id_tennis))
  .all();

console.log(result);
```