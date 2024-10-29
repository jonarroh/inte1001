import { Result } from "../../utils/types";
import { db } from "../db";
import * as schema from "../db/schema"; // Asegúrate de que tu archivo schema tenga las definiciones necesarias
import { eq } from "drizzle-orm";
import { loggerInsert, loggerSelect } from "../db/schema/logger";

export default class LoggerController {
  async createLog(body: loggerInsert): Promise<Result<boolean, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.logger).values(body).execute();
      });

      return { isOk: true, value: true };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to create log entry' };
    }
  }

  async getLogs(): Promise<Result<loggerSelect[], string>> {
    try {
      const result = await db.select().from(schema.logger);
      if (result) {
        return { isOk: true, value: result };
      }
      return { isOk: false, error: 'No logs found' };
    } catch (error) {
      return { isOk: false, error: 'Failed to retrieve logs' };
    }
  }

  async getLogsBy(type: "info" | "error" | "warning"): Promise<Result<loggerSelect[], string>> {
    try {
      const result = await db.select().from(schema.logger).where(eq(schema.logger.type, type));
      if (result.length > 0) {
        return { isOk: true, value: result };
      }
      return { isOk: false, error: `No logs found for type: ${type}` };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to retrieve logs by type' };
    }
  }
}
