import { Result } from "../../utils/types";
import { db } from "../db";
import { insertBadge, selectBadge, selectUserBadge } from "../db/schema/badge";


import * as schema from "../db/schema";
import { eq , and, lt, gt, gte } from "drizzle-orm";

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

  async insertBadge(body: insertBadge): Promise<Result<selectBadge, string>> {
    try {
      
      await db.transaction(async (trx) => {
        //validar que el nombre no exista
        const badge = db.select().from(schema.badges).where(eq(schema.badges.name, body.name)).get();
        if (badge) {
          return { isOk: false, error: 'Badge already exists' };
        }
        await trx.insert(schema.badges).values(body).execute();
      });
      const result = db.select().from(schema.badges).where(eq(schema.badges.name, body.name)).get();
      
      return { isOk: true, value: result };

    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to insert badge' };
    }
  }

  async updateBadge(newBadge: insertBadge, id: number): Promise<Result<selectBadge, string>> {
    try {
      console.log("updateBadge", newBadge);
      await db.transaction(async (trx) => {
       
        await trx.update(schema.badges).set(newBadge).where(eq(schema.badges.id, id)).execute();
      });
      const result = db.select().from(schema.badges).where(eq(schema.badges.id, id)).get();
      console.log(result);
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

  async sendToCDN(file: File, idFile: string): Promise<Result<string, string>> {
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('id', idFile);
      const response = await fetch('http://localhost:5000/badge/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        return { isOk: true, value: data.url };
      }
      return { isOk: false, error: 'Failed to upload image to CDN' };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to upload image to CDN' };
    }
  }

}

export class UserBadges{

  async getUserBadges(userId: number): Promise<Result<any[], string>> {
    try {
      const result = (await db.select().from(schema.userBadges)
      .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
      .where(eq(schema.userBadges.userId, userId)));
      if (result) {
        return { isOk: true,value: result };
      }
      return { isOk: false, error: 'No se encontraron insignias' };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener las insignias' };
    }
  }

  async getAllUserBadges(): Promise<Result<selectUserBadge[], string>> {
    try {
      const result = await db.select().from(schema.userBadges);
      if (result) {
        return { isOk: true,value: result };
      }
      return { isOk: false, error: 'No se encontraron insignias' };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener las insignias' };
    }
  }

  async addUserBadge(userId: number, badgeId: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.userBadges).values({ userId, badgeId }).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al insertar la insignia' };
    }
  }
  async removeUserBadge(userId: number, badgeId: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.delete(schema.userBadges).where(and(eq(schema.userBadges.userId, userId), eq(schema.userBadges.badgeId, badgeId))).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al eliminar la insignia' };
    }
  }

  async removeAllUserBadges(userId: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.delete(schema.userBadges).where(eq(schema.userBadges.userId, userId)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al eliminar las insignias' };
    }
  }

  async getUserPoints(userId: number): Promise<Result<number, string>> {
    try {
      const result = await db.select().from(schema.userBadgesPoints).where(eq(schema.userBadgesPoints.userId, userId));
      if (result) {
        return { isOk: true,value: result[0].pointsAccumulated };
      }
      return { isOk: false, error: 'No se encontraron puntos' };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener los puntos' };
    }
  }

  async addUserPoints(userId: number, points: number): Promise<Result<boolean, string>> {
    try {
      const lastMonth = db.select().from(schema.userBadgesPoints).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString()))).get();

      //agregar los badges en los que tenga los puntos requeridos
      const badges = db.select().from(schema.badges)
      .where(gte(schema.badges.pointsRequired, points))
      .all();

      //agregar los badges que no tenga
      const userBadges = db.select().from(schema.userBadges)
      .where(eq(schema.userBadges.userId, userId))
      .all();

      const badgesToAdd = badges.filter((badge) => !userBadges.some((userBadge) => userBadge.badgeId === badge.id));

      for (const badge of badgesToAdd) {
        await this.addUserBadge(userId, badge.id);
      }

      if (lastMonth) {
        await db.transaction(async (trx) => {
          await trx.update(schema.userBadgesPoints).set({ pointsAccumulated: lastMonth.pointsAccumulated + points }).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString()))).execute();
        });
      } else {
        await db.transaction(async (trx) => {
          await trx.insert(schema.userBadgesPoints).values({ userId, pointsAccumulated: points, month: new Date().getMonth().toString() }).execute();
        });
      }
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al insertar los puntos' };
    }
  }

  async removeUserPoints(userId: number, points: number): Promise<Result<boolean, string>> {
    try {
        const lastMonth = await db
            .select()
            .from(schema.userBadgesPoints)
            .where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString())))
            .get();

        if (lastMonth) {
            const newPoints = lastMonth.pointsAccumulated - points;

            if (newPoints < 0) {
                return { isOk: false, error: 'No se puede reducir los puntos por debajo de 0.' };
            }

            await db.transaction(async (trx) => {
                await trx
                    .update(schema.userBadgesPoints)
                    .set({ pointsAccumulated: newPoints })
                    .where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString())))
                    .execute();
            });
        }

        return { isOk: true, value: true };
    } catch (error) {
        console.error(error);
        return { isOk: false, error: 'Error al eliminar los puntos' };
    }
}

}