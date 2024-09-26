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


export const userBadgesPoints = sqliteTable('user_badges_points', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  pointsAccumulated: integer('points_accumulated').notNull().default(0),
  month: text('month').notNull().default(sql`(current_timestamp)`),
});


// Inferencia de tipos
type insertBadge = typeof badges.$inferInsert;
type selectBadge = typeof badges.$inferSelect;


type insertUserBadge = typeof userBadges.$inferInsert;
type selectUserBadge = typeof userBadges.$inferSelect;

type insertUserBadgePoints = typeof userBadgesPoints.$inferInsert;
type selectUserBadgePoints = typeof userBadgesPoints.$inferSelect;

export type {
  insertBadge,
  selectBadge,
  insertUserBadge,
  selectUserBadge,
  insertUserBadgePoints,
  selectUserBadgePoints
}