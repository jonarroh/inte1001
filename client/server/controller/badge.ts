import { Result } from "../../utils/types";
import { db } from "../db";
import { insertBadge, selectBadge, selectUserBadge } from "../db/schema/badge";


import * as schema from "../db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export default class BadgeController {

  async getBadges(): Promise<Result<selectBadge[], string>> {
    try {
      const result = await db.select().from(schema.badges);
      if (result) {
        return { isOk: true, value: result };
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
      const response = await fetch('http://191.101.1.86:5000/badge/upload', {
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

export class UserBadges {

  async getUsersPerBadge(date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear") {
    try {
      const dateCondition = this.getDateCondition(date);

      // Obtener insignias
      const badges = await db.select().from(schema.badges).all();
      if (!badges) {
        return { isOk: false, error: 'No badges found' };
      }

      const userBadges = await db.select().from(schema.userBadges).all();

      const result = badges.map(badge => {
        const users = userBadges.filter(userBadge => userBadge.badgeId === badge.id);
        return {
          badge: badge.name,
          userCount: users.length
        };
      });

      return { isOk: true, value: result };
    } catch (error) {

      return { isOk: false, error: 'Failed to fetch' };
    }
  }

  getDateCondition(date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear") {
    switch (date) {
      case "today":
        return sql`DATE(achievedAt) = DATE(CURRENT_DATE)`;
      case "yesterday":
        return sql`DATE(achievedAt) = DATE(CURRENT_DATE, '-1 day')`;
      case "lastWeek":
        return sql`DATE(achievedAt) >= DATE(CURRENT_DATE, '-7 days')`;
      case "lastMonth":
        return sql`DATE(achievedAt) >= DATE(CURRENT_DATE, '-1 month')`;
      case "lastYear":
        return sql`DATE(achievedAt) >= DATE(CURRENT_DATE, '-1 year')`;
      default:
        return sql`DATE(achievedAt) = DATE(${date})`;
    }
  }

  async getUserBadges(userId: number): Promise<Result<any[], string>> {
    try {
      const result = (await db.select().from(schema.userBadges)
        .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
        .where(eq(schema.userBadges.userId, userId)));

console.log("result",result);

      if (result) {
        return { isOk: true, value: result };
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
        return { isOk: true, value: result };
      }
      return { isOk: false, error: 'No se encontraron insignias' };
    } catch (error) {
      return { isOk: false, error: 'Error al obtener las insignias' };
    }
  }

  async addUserBadge(userId: number, badgeId: number): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        //validar que no se haya insertado antes
        const userBadge = db.select().from(schema.userBadges).where(and(eq(schema.userBadges.userId, userId), eq(schema.userBadges.badgeId, badgeId))).get();
        if (userBadge) {
          return { isOk: true, value: true };
        }
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
      const month = new Date().getMonth().toString();

      const result = db.select().from(schema.userBadgesPoints).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, month))).get();
      if (result) {
        return { isOk: true, value: result.pointsAccumulated };
      }


      //si no hay puntos, devolver 0 y registrar el mes
      return { isOk: true, value: 0 }
    } catch (error) {
      //si hay error, devolver 0 y registrar el mes
      return { isOk: false, error: 'Error al obtener los puntos' };
    }
  }

  async addUserPoints(userId: number, points: number): Promise<Result<number, string>> {
    try {
      await db.transaction(async (trx) => {
        //validar que el nombre no exista
        const badge = db.select().from(schema.userBadgesPoints).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString()))).get();
        if (badge) {
          await trx.update(schema.userBadgesPoints).set({ pointsAccumulated: badge.pointsAccumulated + points }).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString()))).execute();
        } else {
          await trx.insert(schema.userBadgesPoints).values({ userId, pointsAccumulated: points, month: new Date().getMonth().toString() }).execute();
        }
      }
      );

      const newAccumulatedPoints = db.select().from(schema.userBadgesPoints).where(and(eq(schema.userBadgesPoints.userId, userId), eq(schema.userBadgesPoints.month, new Date().getMonth().toString()))).get();
      console.log({ newAccumulatedPoints });
      if (newAccumulatedPoints) {

        //ver si se puede agregar un nuevo user_badge
        const badges = db.select().from(schema.badges).all();

        if (badges) {
          for (const badge of badges) {
            if (newAccumulatedPoints.pointsAccumulated >= badge.pointsRequired) {
              await this.addUserBadge(userId, badge.id);
            }
          }
        }
        return { isOk: true, value: newAccumulatedPoints.pointsAccumulated };
      } else {
        return { isOk: false, error: 'Failed to retrieve new accumulated points' };
      }
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Error al insertar los puntos' };
    }
  }



}