import { Result } from '../../utils/types';
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

  async getOnlyLoggedLocation(
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

  async getOnlyNotLoggedLocation(
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
  async getLastThreeMonthsLoggedAndNotLoggedLocation(): Promise<Result<{ date: string; loggedCount: number; notLoggedCount: number }[], string>> {
    try {
      // Obtener las fechas de los últimos tres meses
      const dates = this.getLastThreeMonths();

      // Realizamos la búsqueda para cada mes de la fecha calculada
      const result = await Promise.all(dates.map(async (currentDate) => {
        const dateCondition = this.getDateCondition(currentDate);

        // Obtener el conteo de ubicaciones registradas (isLogged = 1)
        const loggedCountResult = await db
          .select({
            count: sql<number>`COUNT(*)`
          })
          .from(schema.location)
          .where(and(eq(schema.location.isLogged, 1), dateCondition));

        // Obtener el conteo de ubicaciones no registradas (isLogged = 0)
        const notLoggedCountResult = await db
          .select({
            count: sql<number>`COUNT(*)`
          })
          .from(schema.location)
          .where(and(eq(schema.location.isLogged, 0), dateCondition));

        // Extraer los conteos de los resultados
        const loggedCount = loggedCountResult[0]?.count ?? 0;
        const notLoggedCount = notLoggedCountResult[0]?.count ?? 0;

        // Retornar los resultados formateados
        return {
          date: currentDate,
          loggedCount,
          notLoggedCount
        };
      }));

      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch logged and not logged location records for last three months' };
    }
  }

  // Función para obtener los últimos tres meses
  getLastThreeMonths() {
    const today = new Date();
    return [0, 1, 2].map((monthDiff) => {
      const date = new Date(today);
      date.setMonth(today.getMonth() - monthDiff);
      return date.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
    });
  }

  async getBothLoggedAndNotLoggedLocation(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ): Promise<Result<{ loggedCount: number; notLoggedCount: number; logged: selectLocation[]; notLogged: selectLocation[] }, string>> {
    try {
      const dateCondition = this.getDateCondition(date);

      // Obtener las ubicaciones registradas (isLogged = 1)
      const logged = await db
        .select()
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 1), dateCondition));

      // Obtener las ubicaciones no registradas (isLogged = 0)
      const notLogged = await db
        .select()
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 0), dateCondition));

      // Obtener los conteos
      const loggedCountResult = await db
        .select({
          count: sql<number>`COUNT(*)`
        })
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 1), dateCondition));

      const notLoggedCountResult = await db
        .select({
          count: sql<number>`COUNT(*)`
        })
        .from(schema.location)
        .where(and(eq(schema.location.isLogged, 0), dateCondition));

      // Extraer los conteos de los resultados
      const loggedCount = loggedCountResult[0]?.count ?? 0;
      const notLoggedCount = notLoggedCountResult[0]?.count ?? 0;

      // Combinar los resultados en un solo objeto
      const result = {
        logged,
        notLogged,
        loggedCount,
        notLoggedCount
      };

      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch both logged and not logged location records' };
    }
  }

  async getLoggedAndNotLoggedAndDeviceTypeLocation(
    date: string | "today" | "yesterday" | "lastWeek" | "lastMonth" | "lastYear"
  ) {
    try {
      const dateCondition = this.getDateCondition(date);

      const rawData = await db
        .select({
          date: sql<string>`DATE(createdAt)`,
          desktop: sql<number>`SUM(CASE WHEN deviceType = 'Desktop' THEN 1 ELSE 0 END)`,
          tablet: sql<number>`SUM(CASE WHEN deviceType = 'Tablet' THEN 1 ELSE 0 END)`,
          mobile: sql<number>`SUM(CASE WHEN deviceType = 'Mobile' THEN 1 ELSE 0 END)`,
        })
        .from(schema.location)
        .where(dateCondition)
        .groupBy(sql<string>`DATE(createdAt)`);

      // Procesar los resultados para generar un array de objetos
      const processedData = rawData.map(({ date, desktop, tablet, mobile }) => {
        return {
          date,
          desktop,
          tablet,
          mobile
        };
      });

      return { isOk: true, value: processedData };
    } catch (error) {
      return { isOk: false, error: error.message };
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

  async deleteLocation(token: string): Promise<Result<boolean, string>> {
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


  async getTotalLocations(
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

  async getDeviceAndBrowserStats(
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

      // Procesa los resultados para eliminar la versión del navegador
      const processedStats = stats.map(({ deviceType, browser, count }) => {
        // Extrae solo el nombre del navegador (elimina la versión)
        const browserName = browser.split('/')[0]; // Asumiendo formato "Navegador/Versión"
        return { deviceType, browser: browserName, count };
      });

      // Segundo 'groupBy' usando 'reduce' para agrupar por 'deviceType' y 'browser'
      const groupedStats = processedStats.reduce((acc, { deviceType, browser, count }) => {
        // Crea una clave única para cada grupo (combinando deviceType y browser)
        const key = `${deviceType}-${browser}`;
        if (!acc[key]) {
          acc[key] = { deviceType, browser, count: 0 };
        }
        acc[key].count += count; // Suma el conteo en caso de que haya múltiples entradas con la misma combinación
        return acc;
      }, {});

      // Convertir el objeto agrupado de vuelta a un array
      const finalStats = Object.values(groupedStats) as { deviceType: string; browser: string; count: number }[];

      return { isOk: true, value: finalStats };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch device and browser statistics' };
    }
  }



}
