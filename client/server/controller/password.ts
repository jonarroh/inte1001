import { db } from './../db';
import * as schema from "../db/schema";
import { eq } from 'drizzle-orm';
import { Result } from '../../utils/types';
import { insertPasswordRecovery } from '../db/schema/password';

export default class PasswordController {

  async createRecoveryCode(email: string): Promise<Result<null, string>> {
    const code = this.generateRecoveryCode(); // Genera un código de recuperación único
    const createdAt = new Date().toISOString(); // Captura la fecha actual
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // Define la expiración del código (5 minutos)

    const userId = await this.getUserByEmail(email); // Obtiene el ID del usuario
    console.log(userId);

    if (!userId) {
      return { isOk: false, error: 'User not found' };
    }
    const recoveryData: insertPasswordRecovery = {
      code,
      userId,
      createdAt,
      expiresAt,
      isUsed: 0,
    };

    try {
      await db.transaction(async (trx) => {
        await trx.insert(schema.passwordRecovery).values(recoveryData).execute();
      });

      // Envía el correo electrónico con el código de recuperación
      await this.sendEmail(email, code); // Usa el correo recibido como parámetro

      return { isOk: true, value: null };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to create recovery code' };
    }
  }


private async getUserByEmail(email: string): Promise<number | null> {
    try{
      console.log("getUserByEmail", email);
      const resp = await fetch('http://192.168.100.18:5275/api/Users/getId',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      })
      const userId = await resp.json();
      console.log(userId);
      return userId.id; 
    }
    catch (error){
      console.error(error);
      return null;
    }
}


  async changePassword(email: string, newPassword: string, code: string): Promise<Result<null, string>> {
    try {
      // Verifica el código de recuperación
      const userId = await this.getUserByEmail(email);

      if (!userId) {
        return { isOk: false, error: 'User not found' };
      }

      const recoveryRecord = await db.select().from(schema.passwordRecovery).where(eq(schema.passwordRecovery.code, code)).get();

      if (!recoveryRecord || recoveryRecord.isUsed === 1 || new Date(recoveryRecord.expiresAt) < new Date()) {
        return { isOk: false, error: 'Invalid or expired recovery code' };
      }

      // Cambia la contraseña del usuario
      await this.forceChangePassword(userId, newPassword);

      //Marca el código como usado
      await db.transaction(async (trx) => {
        await trx.update(schema.passwordRecovery).set({ isUsed: 1 }).where(eq(schema.passwordRecovery.id, recoveryRecord.id)).execute();
      });

      return { isOk: true, value: null };
    } catch (error) {
      console.error(error);
      return { isOk: false, error: 'Failed to change password' };
    }
  }

  private async sendEmail(email: string, code: string): Promise<void> {
    const emailData = {
      to: email, // Usa el correo recibido como parámetro
      subject: "Recuperacion de contraseña",
      htmlBody: `Hola, tu código de recuperación es: ${code}`,
    };

    try{
      await fetch('http://191.101.1.86:3000/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
    } catch (error: unknown) {
      console.error('Failed to send email', error);
    }
  }

  private async forceChangePassword(userId: number, newPassword: string): Promise<void> {
    const data = {
      newPassword,
      userId,
    };
    console.log(data);
    try{
      await fetch('http://192.168.100.18:5275/api/Users/forceChangePassword', {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error: unknown) {
      console.error('Failed to force change password', error);
      throw new Error('Failed to force change password');
    }
  }

  private generateRecoveryCode(): string {
    // Aquí puedes implementar la lógica para generar un código único (puede ser un UUID, una cadena aleatoria, etc.)
    return Math.random().toString(36).substring(2, 10); // Ejemplo simple de código aleatorio
  }
}
