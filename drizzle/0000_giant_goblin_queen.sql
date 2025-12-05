CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`zk_proof_hash` text NOT NULL,
	`payment_tx_hash` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` text DEFAULT 'sql`(current_timestamp)`' NOT NULL,
	`updatedAt` text DEFAULT 'sql`(current_timestamp)`' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_id_unique` ON `orders` (`order_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`in_stock` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'sql`(current_timestamp)`' NOT NULL,
	`updatedAt` text DEFAULT 'sql`(current_timestamp)`' NOT NULL
);
