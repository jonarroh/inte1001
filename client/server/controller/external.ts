
import { Result } from "../../utils/types";
import { db } from "../db";
import * as schema from "../db/schema"; // Asegúrate de que tu archivo schema tenga las definiciones necesarias
import { desc, eq, sql } from "drizzle-orm";
import { selectExternalUserInteractions,insertExternalUserInteractions} from "../db/schema/badge";

export class ExternalUserInteractionsController{
  async insert(external:insertExternalUserInteractions): Promise<Result<insertExternalUserInteractions, string>> {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.ExternalUserInteractions).values(external).execute();
      });
      return { isOk: true, value: external };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to insert external user interactions' };
    }
  }

  async getExternalUserInteractions(): Promise<Result<selectExternalUserInteractions[], string>> {
    try {
      const result = await db.select().from(schema.ExternalUserInteractions);
      if (result) {
        return { isOk: true, value: result };
      }
      return { isOk: false, error: 'No external user interactions found' };
    } catch (error) {
      return { isOk: false, error: 'Failed to retrieve external user interactions' };
    }
  }


  async getEmailHistiry(): Promise<Result<selectExternalUserInteractions[], string>> {
    try {
      const result = await db.select().from(schema.ExternalUserInteractions)
      .where(eq(schema.ExternalUserInteractions.interactionType, 'email'))
      .groupBy(schema.ExternalUserInteractions.interactionAt)
      .orderBy(desc(schema.ExternalUserInteractions.interactionAt));
      if (result) {
        return { isOk: true, value: result };
      }
      return { isOk: false, error: 'No external user interactions found' };
    } catch (error) {
      return { isOk: false, error: 'Failed to retrieve external user interactions' };
    }
  }


  async getMessagesGroupedByUser(): Promise<Result<{
    id: number,
    nombre: string,
    messages: {
      data: string,
      date: string
    }[]
  }[], string>> {
  try {
    // Realizamos la consulta seleccionando userId, interactionData (data) y createdAt (date)
    const result = await db
      .select({
        id: schema.ExternalUserInteractions.userId,
        messages: sql<{ data: string, date: string }[]>`
          json_group_array(
            json_object(
              'data', ${schema.ExternalUserInteractions.interactionData},
              'date', ${schema.ExternalUserInteractions.interactionAt}
            )
          )
        `.as('messages')
      })
      .from(schema.ExternalUserInteractions)
      .groupBy(schema.ExternalUserInteractions.userId);


      const users = await fetch('http://192.168.100.18:5275/api/Users').then((res) => res.json());

    // Transformamos el resultado a la estructura deseada
    const formattedResult = result.map(row => ({
      id: row.id,
      nombre: users.find((user: { id: number }) => user.id === row.id).name,
      //@ts-ignore
      messages: JSON.parse(row.messages) // Convertimos el JSON string a objetos
    }));

    if (formattedResult.length > 0) {
      return { isOk: true, value: formattedResult };
    }

    return { isOk: false, error: 'No messages found' };
  } catch (error) {
    return { isOk: false, error: `Failed to retrieve messages: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

}