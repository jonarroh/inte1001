
import { sqliteTable, text, integer,real } from "drizzle-orm/sqlite-core";


const users = sqliteTable("users", {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: text('role',{
    enum: ['admin', 'user','inventory']
  }).notNull(),
});

export default users;

type insertUsers = typeof users.$inferInsert;
type selectUsers = typeof users.$inferSelect;
type Roles = 'admin' | 'user' | 'inventory';

export type {
  insertUsers,
  selectUsers,
  Roles
}