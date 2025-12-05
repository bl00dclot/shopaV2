import { sqliteTable, uniqueIndex, text, integer } from "drizzle-orm/sqlite-core"

export const orders = sqliteTable("orders", {
	id: text().primaryKey().notNull(),
	orderId: text("order_id").notNull(),
	zkProofHash: text("zk_proof_hash").notNull(),
	paymentTxHash: text("payment_tx_hash").notNull(),
	status: text().notNull(),
	createdAt: text().default("sql`(current_timestamp)`").notNull(),
	updatedAt: text().default("sql`(current_timestamp)`").notNull(),
},
(table) => [
	uniqueIndex("orders_order_id_unique").on(table.orderId),
]);

export const products = sqliteTable("products", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	price: text().notNull(),
	description: text().notNull(),
	image: text().notNull(),
	inStock: integer("in_stock").default(0).notNull(),
	createdAt: text().default("sql`(current_timestamp)`").notNull(),
	updatedAt: text().default("sql`(current_timestamp)`").notNull(),
});

