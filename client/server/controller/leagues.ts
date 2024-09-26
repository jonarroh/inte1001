import { Result } from "../../utils/types";
import { db } from "../db";
import { insertLeague, selectLeague } from "../db/schema/leagues";

import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export default class LeaguesController{

  async getLeagues(): Promise<Result<selectLeague[], string>> {
    try {
      const result = await db.select().from(schema.leagues);
      if (result) {
        return { isOk: true,value: result };
      }
      return { isOk: false, error: 'No se encontraron ligas' };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener las ligas' };
    }
  }

  async getLeagueById(id: number): Promise<Result<selectLeague | null, string>> {
    try {
      const result = db.select().from(schema.leagues).where(eq(schema.leagues.id, id)).get();
      return { isOk: true, value: result ?? null };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener la liga por ID' };
    }
  }

  async insertLeague(body: insertLeague): Promise<Result<selectLeague, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.leagues).values(body).execute();
      });
      const result = db.select().from(schema.leagues).where(eq(schema.leagues.name, body.name)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al insertar la liga' };
    }
  }

  async updateLeague(newLeague: insertLeague, id: number): Promise<Result<selectLeague, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.update(schema.leagues).set(newLeague).where(eq(schema.leagues.id, id)).execute();
      });
      const result = db.select().from(schema.leagues).where(eq(schema.leagues.id, id)).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al actualizar la liga' };
    }
  }

  async deleteLeague(id: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.delete(schema.leagues).where(eq(schema.leagues.id, id)).execute();
        await trx.delete(schema.userLeagues).where(eq(schema.userLeagues.leagueId, id)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al eliminar la liga' };
    }
  }

}

