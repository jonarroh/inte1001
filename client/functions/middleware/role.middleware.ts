import { createMiddleware } from "hono/factory";
import { Roles } from "../db/schema/users";
import { decode } from "hono/jwt";

export const roleMiddleware = (allowedRoles: Roles[]) => {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Token is required' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = decode(token);

    if (!decoded) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const role = decoded.payload.role;

    if (!allowedRoles.includes(role as Roles)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await next();
  });
};