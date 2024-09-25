import { Result } from "../../utils/types";
import { db } from "../db";
import { selectBadge } from "../db/schema/badge";

import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export default class BadgeController{

  async getBadges(): Promise<Result<selectBadge[], string>> {
    try {
      const result = await db.select().from(schema.badges);
      if (result) {
        return { isOk: true,value: result };
      }
      return { isOk: false, error: 'No badges found' };
    } catch (error) {
      return { isOk: false, error: 'Failed to get badges' };
    }
  }

  async getBadgeById(id: number): Promise<Result<selectBadge | null, string>> {
    try {
      const result = db.select().from(schema.badges).where(eq(schema.badges.id, id)).get();
      return { isOk: true, value: result ?? null };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch badge by ID' };
    }
  }

  async insertBadge(body: selectBadge): Promise<Result<selectBadge, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.badges).values(body).execute();
      });
      const result = db.select().from(schema.badges).where(eq(schema.badges.name, body.name)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to insert badge' };
    }
  }

  async updateBadge(newBadge: selectBadge, id: number): Promise<Result<selectBadge, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.update(schema.badges).set(newBadge).where(eq(schema.badges.id, id)).execute();
      });
      const result = db.select().from(schema.badges).where(eq(schema.badges.id, id)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to update badge' };
    }
  }

  async deleteBadge(id: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.delete(schema.badges).where(eq(schema.badges.id, id)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to delete badge' };
    }
  }

}