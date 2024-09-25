import { sql } from "drizzle-orm";
import { sqliteTable, text, integer,real } from "drizzle-orm/sqlite-core";

export const badges = sqliteTable("badges", {
  id:integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  pointsRequired: integer('points_required').notNull(),
});

export const userBadges = sqliteTable('user_badges', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),  
  badgeId: integer('badge_id').notNull(),
  achievedAt: text('achieved_at').notNull().default(sql`(current_timestamp)`),
  badgeFk: integer('badge_id').references(() => badges.id),
});


// Inferencia de tipos
type insertBadge = typeof badges.$inferInsert;
type selectBadge = typeof badges.$inferSelect;

type insertUserBadge = typeof userBadges.$inferInsert;

export type {
  insertBadge,
  selectBadge,
  insertUserBadge
}