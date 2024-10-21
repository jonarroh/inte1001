import { Result } from "../../utils/types";
import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
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

  async getOnlyLoggedLocation(): Promise<Result<selectLocation[], string>> {
    try {
      const result = await db
        .select()
        .from(schema.location)
        .where(eq(schema.location.isLogged, 1));
      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch logged location records' };
    }
  }
  async getOnlyNotLoggedLocation(): Promise<Result<selectLocation[], string>> {
    try {
      const result = await db
        .select()
        .from(schema.location)
        .where(eq(schema.location.isLogged, 0));
      return { isOk: true, value: result };
    } catch (error) {
      return { isOk: false, error: 'Failed to fetch not logged location records' };
    }
  }

  async addNewLocation(body: insertLocation): Promise<Result<selectLocation, string>> {
    try {
      await db.transaction(async (trx) => {
        //antes de insertar, se debe verificar si el token ya existe
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
        await trx.delete(schema.location).execute();
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
        await trx.delete(schema.location).where(eq(schema.location.token, token)).execute();
      });
      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to delete location record' };
    }
  }
}
