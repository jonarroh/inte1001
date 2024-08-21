import { sqliteTable, text, integer,real } from "drizzle-orm/sqlite-core";
import tennis, { type selectTennis } from "./tennis";
// Tabla Categories
export const categories = sqliteTable("categories", {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});

// Tabla intermedia para relación N:M
export const tennisCategories = sqliteTable("tennis_categories", {
  tennisId: integer('tennis_id').notNull().references(() => tennis.id), // Referencia a tennis
  categoryId: integer('category_id').notNull().references(() => categories.id), // Referencia a categories
});



// Inferencia de tipos
type insertCategory = typeof categories.$inferInsert;
type selectCategory = typeof categories.$inferSelect;
type insertTennisCategory = typeof tennisCategories.$inferInsert;


export type {
  insertCategory,
  selectCategory,
  insertTennisCategory
}
