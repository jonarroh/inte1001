import { sqliteTable, text, integer,real, foreignKey } from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';

export const leagues = sqliteTable("leagues", {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  pointsRequired: integer('points_required').notNull(),
});


export const userLeagues = sqliteTable('user_leagues', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),            // ID del usuario (relación con la otra base)
  leagueId: integer('league_id').notNull(),        // ID de la liga en la que se encuentra el usuario
  pointsAccumulated: integer('points_accumulated').notNull().default(0), // Puntos acumulados este mes
  month: text('month').notNull().default(sql`(current_timestamp)`), // Mes en el que se acumulan los puntos
  // Llaves foráneas
  leagueFk: integer('league_id').references(() => leagues.id),
});

export const userLeaguesPoints = sqliteTable('user_leagues_points', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  pointsAccumulated: integer('points_accumulated').notNull().default(0),
  month: text('month').notNull().default(sql`(current_timestamp)`),
});


// Inferencia de tipos
type insertLeague = typeof leagues.$inferInsert;
type selectLeague = typeof leagues.$inferSelect;

type insertUserLeague = typeof userLeagues.$inferInsert;
type selectUserLeague = typeof userLeagues.$inferSelect;

type insertUserLeaguePoints = typeof userLeaguesPoints.$inferInsert;
type selectUserLeaguePoints = typeof userLeaguesPoints.$inferSelect;

export type {
  insertLeague,
  selectLeague,
  insertUserLeague,
  selectUserLeague,
  insertUserLeaguePoints,
  selectUserLeaguePoints
}

