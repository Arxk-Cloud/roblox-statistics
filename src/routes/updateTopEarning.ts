import { drizzle } from "drizzle-orm/d1";
import { getAllTopEarning } from "../functions/getAllTopEarning";
import * as schema from "../db/schema";

import type { Context } from "hono";

export default async function POST(c: Context) {
  const env = c.env as Env;
  const db = drizzle(env.DB, { schema });
  console.log("Updating top earning");

  // Remove all existing games
  const deleted = await db.delete(schema.TopEarningGames);
  console.log(`Deleted ${deleted.results.length} games`);

  // Insert all new
  const allGames = await getAllTopEarning(env.ROBLOX_ACCOUNT_COOKIE);
  const batchSize = 20;
  for (let i = 0; i < allGames.length; i += batchSize) {
    const batch = allGames.slice(i, i + batchSize);
    await db.insert(schema.TopEarningGames).values(
      batch.map((game, index) => ({
        rank: i + index + 1,
        universeId: game.universeId,
        rootPlaceId: Number(game.rootPlaceId),
        gameData: JSON.stringify(game),
      }))
    );
  }

  return new Response("Successfully updated top earning games", { status: 200 });
}
