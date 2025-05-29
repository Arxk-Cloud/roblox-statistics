import getTopEarningPosition from "./routes/getTopEarningPosition";
import updateTopEarning from "./routes/updateTopEarning";
import getAllTopEarning from "./routes/getAllTopEarning";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";

// Middleware
import { logging } from "./middleware/logging";
import { parseGzippedJson } from "./middleware/gzip-json";
import { errorHandler } from "./middleware/error";
import { authMiddleware } from "./middleware/auth";

interface Env {
  DB: D1Database;
  ROBLOX_ACCOUNT_COOKIE: string;
  ROBLOX_KV: KVNamespace;
  CALL_AUTH_TOKEN: string;
}

const app = new Hono<{ Bindings: Env }>();

// Logging
app.use(logging);

// Parse the request body as a JSON object
app.use(parseGzippedJson);

// Error handler
app.onError(errorHandler);

// Auth middleware
app.use(authMiddleware);

app.get("/", (c) => {
  return c.json({
    message: "Up and running",
  });
});

app.get("/api/getTopEarningPosition", getTopEarningPosition);
app.get("/api/getAllTopEarning", getAllTopEarning);
app.post("/api/updateTopEarning", updateTopEarning);

app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

// Show routes
showRoutes(app);

export default app;