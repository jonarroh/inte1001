import { db } from './../db';
import * as schema from "../db/schema";
import { and, eq } from 'drizzle-orm';
import { Result } from '../../utils/types';
import { selectUsers } from '../db/schema/users';
import { sign } from 'hono/jwt';

export default class AuthController {


  async login(email: string, password: string): Promise<Result<selectUsers | null, string>> {
    try {
      const result = db.select().from(schema.users).where(and(eq(schema.users.email, email), eq(schema.users.password, password))).get();
      if (result) {
        return { isOk: true, value: result };
      }
      return { isOk: false, error: 'Invalid email or password' };
    } catch (error) {
      return { isOk: false, error: 'Failed to login' };
    }
  }

  async createAuth(user:selectUsers){
    const payload = {
      role:user.role,
      email:user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), 
    }
    const secret = '4uT0M4t1cS0l-Th3-4uT0M4t1cS0l'
    return await sign(payload,secret)
  }
  
}