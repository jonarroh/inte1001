import { sqliteTable, text, integer,real } from "drizzle-orm/sqlite-core";
import tennis from "./tennis";
const reviews = sqliteTable("reviews", {
  id: integer('id').primaryKey(),
  tennisId: integer('tennis_id').notNull().references(() => tennis.id), // Relación 1:N
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
});

export default reviews;

type insertReview = typeof reviews.$inferInsert;
type selectReview = typeof reviews.$inferSelect;
type selectReviewWithTennis = typeof reviews.$inferSelect & { tennis: typeof tennis.$inferSelect };

export type {
  insertReview,
  selectReview,
  selectReviewWithTennis,
}
