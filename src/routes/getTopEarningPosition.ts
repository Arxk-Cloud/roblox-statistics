import { eq, or } from "drizzle-orm";
import { TopEarningGames } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";

import type { Context } from "hono";

export default async function GET(c: Context) {
  const env = c.env as Env;
  const url = new URL(c.req.url);
  const gameId = url.searchParams.get("gameId");

  if (!gameId) {
    return new Response("Game ID is required", { status: 400 });
  }

  // Check if the position is cached
  const cachedPosition = await env.ROBLOX_KV.get(`top-earning-position-${gameId}`);
  if (cachedPosition) {
    return new Response(cachedPosition, { status: 200 });
  }

  const db = drizzle(env.DB, { schema });

  const topEarningGames = await db.query.TopEarningGames.findFirst({
    where: or(
      eq(TopEarningGames.universeId, Number(gameId)),
      eq(TopEarningGames.rootPlaceId, Number(gameId))
    )
  });

  if (!topEarningGames) {
    return new Response("Game not found", { status: 404 });
  }

  // Cache for 15 minutes
  await env.ROBLOX_KV.put(`top-earning-position-${gameId}`, JSON.stringify({
    position: topEarningGames.rank,
  }), {
    expirationTtl: 60 * 15,
  });

  return new Response(JSON.stringify({
    position: topEarningGames.rank,
  }), { status: 200 });
}