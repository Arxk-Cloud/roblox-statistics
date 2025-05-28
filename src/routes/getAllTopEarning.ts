import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";

import type { Game } from "../functions/getAllTopEarning";
import type { Context } from "hono";

interface Env {
	DB: D1Database;
	ROBLOX_KV: KVNamespace;
}

export default async function GET(c: Context) {
  const env = c.env as Env;

  // Check if the top earning games are cached
  const cachedTopEarningGames = await env.ROBLOX_KV.get(`top-earning-games`);
  if (cachedTopEarningGames) {
    return new Response(cachedTopEarningGames, { status: 200 });
  }

  const db = drizzle(env.DB, { schema });
  const topEarningGames = await db.query.TopEarningGames.findMany();

  const response = JSON.stringify(topEarningGames.map(game => ({
    universeId: game.universeId,
    rootPlaceId: game.rootPlaceId,
    rank: game.rank,
    gameData: JSON.parse(game.gameData as string) as Game,
  })));

  // Cache for 25 minutes
  await env.ROBLOX_KV.put(`top-earning-games`, response, {
    expirationTtl: 60 * 25,
  });

  return new Response(response, { status: 200 });
}

