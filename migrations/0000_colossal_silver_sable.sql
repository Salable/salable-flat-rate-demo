CREATE TABLE `Users` (
	`uuid` text PRIMARY KEY NOT NULL,
	`username` text,
	`email` text,
	`salt` text,
	`hash` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_uuid_unique` ON `Users` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_username_unique` ON `Users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_salt_unique` ON `Users` (`salt`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_hash_unique` ON `Users` (`hash`);