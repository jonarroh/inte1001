
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


type inserTennis = typeof tennis.$inferInsert;
type selectTennis = typeof tennis.$inferSelect;

export type {
  inserTennis,
  selectTennis,
}

