import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const TopEarningGames = sqliteTable("top_earning_games", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  universeId: integer("universe_id").notNull().unique(),
  rootPlaceId: integer("root_place_id").notNull().unique(),
  rank: integer("rank").notNull(),
  gameData: text("game_data", { mode: "json" }).notNull(),
});