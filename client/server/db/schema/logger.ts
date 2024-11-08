import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const logger = sqliteTable("logger", {
  id: integer('id').primaryKey(),
  message: text('message').notNull(),
  type: text('type',{
    enum: ['info', 'error', 'warning'],
  }).notNull(),
  from: text('from').notNull(),
  origin: text('origin').notNull(),
});



// Inferencia de tipos
type loggerInsert = typeof logger.$inferInsert;
type loggerSelect = typeof logger.$inferSelect;

export type {
  loggerInsert,
  loggerSelect
}