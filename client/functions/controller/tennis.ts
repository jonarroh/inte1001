import { db } from './../db';
import * as schema from "../db/schema";
import { eq } from 'drizzle-orm';
import { Result } from '../../utils/types';
import { selectTennis,inserTennis } from '../db/schema/tennis';

export default class TennisController {

  async getTennis(): Promise<Result<selectTennis[], string>> {
    try {
      const result = await db.select().from(schema.tennis);
      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch tennis records' };
    }
  }

  async getTennisById(id: number): Promise<Result<selectTennis | null, string>> {
    try {
      const result = await db.select().from(schema.tennis).where(eq(schema.tennis.id, id)).get();
      return { isOk: true, value: result ?? null };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch tennis record by ID' };
    }
  }

  async insertTennis(body: inserTennis): Promise<Result<selectTennis, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.tennis).values(body).execute();
      });
      const result = await db.select().from(schema.tennis).where(eq(schema.tennis.marca, body.marca)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to insert tennis record' };
    }
  }

  async updateTennis(newTennis: inserTennis, id: number): Promise<Result<selectTennis, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.update(schema.tennis).set(newTennis).where(eq(schema.tennis.id, id)).execute();
      });
      const result = await db.select().from(schema.tennis).where(eq(schema.tennis.id, id)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to update tennis record' };
    }
  }

  async deleteTennis(id: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.delete(schema.tennis).where(eq(schema.tennis.id, id)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to delete tennis record' };
    }
  }
}
