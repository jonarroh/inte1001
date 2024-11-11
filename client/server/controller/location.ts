import { Result } from "../../utils/types";
import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { insertLocation, selectLocation } from "../db/schema/location";

export default class LocationController {

  async getLocation(): Promise<Result<selectLocation[], string>> {
    try {
      const result = await db.select().from(schema.location);
      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch location records' };
    }
  }

  async tokenExists(token: string): Promise<Result<boolean, string>> {
    try {
      const result = db
        .select()
        .from(schema.location)
        .where(eq(schema.location.token, token))
        .get();

        if (result) {
          return { isOk: true, value: true };
        }
        return { isOk: true, value: false };
    } catch (error) {
      return { isOk: false, error: 'Failed to check if token exists' };
    }
  }

   getDateCondition(date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear") {
    switch (date) {
      case "today":
        return sql`DATE(createdAt) = DATE(CURRENT_DATE)`;
      case "yesterday":
        return sql`DATE(createdAt) = DATE(CURRENT_DATE, '-1 day')`;
      case "lastWeek":
        return sql`DATE(createdAt) >= DATE(CURRENT_DATE, '-7 days')`;
      case "lastMonth":
        return sql`DATE(createdAt) >= DATE(CURRENT_DATE, '-1 month')`;
      case "lastYear":
        return sql`DATE(createdAt) >= DATE(CURRENT_DATE, '-1 year')`;
      default:
        return sql`DATE(createdAt) = DATE(${date})`;
    }
  }
  
   async  getOnlyLoggedLocation(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ): Promise<Result<selectLocation[], string>> {
    try {
      const dateCondition = this.getDateCondition(date);
      const result = await db
        .select()
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 1), dateCondition));
      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch logged location records' };
    }
  }
  
   async  getOnlyNotLoggedLocation(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ): Promise<Result<selectLocation[], string>> {
    try {
      const dateCondition = this.getDateCondition(date);
      const result = await db
        .select()
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 0), dateCondition));

      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch not logged location records' };
    }
  }

  async addNewLocation(body: insertLocation): Promise<Result<selectLocation, string>> {
    try {
      await db.transaction(async (trx) => {
        const tokenExists = trx
          .select()
          .from(schema.location)
          .where(eq(schema.location.token, body.token))
          .get();
          
        if (tokenExists) {
          console.log('Token already exists');
          return { isOk: false, error: 'Token already exists' };
        }
        else {
          await trx.insert(schema.location).values(body).execute();
        }
      });

      // Obtener la ubicación insertada para asegurarse de que se agregó correctamente
      const result = db
        .select()
        .from(schema.location)
        .where(
          and(
            eq(schema.location.latitude, body.latitude),
            eq(schema.location.longitude, body.longitude),
            eq(schema.location.isLogged, body.isLogged),
            eq(schema.location.token, body.token)
          )
        ).get();
      return { isOk: true, value: result };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to insert location record' };
    }
  }

  async clearLocations(): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.update(schema.location).set({ isLogged: 0 }).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to delete location records' };
    }
  }

  async deleteLocation(token:string): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.update(schema.location).set({ isLogged: 0 }).where(eq(schema.location.token, token)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to delete location record' };
    }
  }


  async  getTotalLocations(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ): Promise<Result<number, string>> {
    try {
      const dateCondition = this.getDateCondition(date);
  
      const [{ count }] = await db
        .select({
          count: sql<number>`COUNT(*)`
        })
        .from(schema.location)
        .where(dateCondition);
  
      return { isOk: true, value: count };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch total locations' };
    }
  }

  async  getDeviceAndBrowserStats(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ): Promise<Result<{ deviceType: string; browser: string; count: number }[], string>> {
    try {
      const dateCondition = this.getDateCondition(date);
  
      const stats = await db
        .select({
          deviceType: schema.location.deviceType,
          browser: schema.location.browser,
          count: sql<number>`COUNT(*)`
        })
        .from(schema.location)
        .where(dateCondition)
        .groupBy(schema.location.deviceType, schema.location.browser);
  
      return { isOk: true, value: stats.map(({ deviceType, browser, count }) => ({ deviceType, browser, count })) };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch device and browser statistics' };
    }
  }
}
