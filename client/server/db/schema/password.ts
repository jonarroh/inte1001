import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const passwordRecovery = sqliteTable("password_recovery", {
  id: integer('id').primaryKey(),
  code: text('code').notNull(), // Código de recuperación
  userId: integer('userId').notNull(), // ID del usuario al que pertenece el código
  createdAt: text('createdAt').notNull().default(sql`current_timestamp`), // Fecha de creación
  expiresAt: text('expiresAt').notNull(), // Fecha de expiración
  isUsed: integer('isUsed').notNull().default(0), // Indica si el código ha sido usado (0 = no, 1 = sí)
});

// Inferencia de tipos
type insertPasswordRecovery = typeof passwordRecovery.$inferInsert;
type selectPasswordRecovery = typeof passwordRecovery.$inferSelect;

export type {
  insertPasswordRecovery,
  selectPasswordRecovery
}

