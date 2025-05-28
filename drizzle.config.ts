import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import fs from "fs";
import path from "path";

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs
      .readdirSync(basePath, { encoding: "utf-8", recursive: true })
      .find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    return path.join(".wrangler", dbFile);
  } catch (err) {
    console.log(`Error ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

export default process.env.NODE_ENV === "production"
  ? defineConfig({
    dialect: "sqlite",
    driver: "d1-http",
    out: "drizzle",
    schema: "./src/db/schema.ts",
    dbCredentials: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
      token: process.env.CLOUDFLARE_D1_TOKEN!,
    },
  })
  : defineConfig({
    dialect: "sqlite",
    out: "drizzle",
    schema: "./src/db/schema.ts",
    dbCredentials: {
      url: getLocalD1DB()!,
    },
  });