import { sqliteTable, text, integer,real } from "drizzle-orm/sqlite-core";


export const location = sqliteTable("location", {
  id: integer('id').primaryKey(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  isLogged: integer('isLogged').notNull(),
  token: text('token').notNull(),
  browser: text('browser').notNull(),
  deviceType: text('deviceType').notNull(),
});


// Inferencia de tipos
type insertLocation = typeof location.$inferInsert;
type selectLocation = typeof location.$inferSelect;

export type {
  insertLocation,
  selectLocation
}