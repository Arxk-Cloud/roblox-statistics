ALTER TABLE `top_earning_games` ADD `universe_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `top_earning_games` ADD `root_place_id` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `top_earning_games_universe_id_unique` ON `top_earning_games` (`universe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `top_earning_games_root_place_id_unique` ON `top_earning_games` (`root_place_id`);