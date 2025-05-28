import { createMiddleware } from "hono/factory";

// We can define the routes that require call token authentication here
const AUTH_ROUTES = ["/api/updateTopEarning"];

/**
 * Authentication middleware
 * @param c - The context object
 * @param next - The next middleware function
 */
export const authMiddleware = createMiddleware(async (c, next) => {
  const env = c.env as Env;

  // Ignore "/" or if the environment is development
  if (AUTH_ROUTES.includes(c.req.path) && c.req.header("Authorization") !== env.CALL_AUTH_TOKEN) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return next();
});