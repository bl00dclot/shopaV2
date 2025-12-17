import { relations } from "drizzle-orm";
import { sqliteTable, uniqueIndex, text, integer, index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core"

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

const table = sqliteTableCreator((name) => name); // or add prefix if you want

export const carts = table('carts', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const cartItems = table(
  'cart_items',
  {
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull(),
    qty: integer('qty').notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cartId, t.productId] }),
    cartIdx: index('cart_items_cart_idx').on(t.cartId),
  })
);

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const paymentSessions = table('payment_sessions', {
  id: text('id').primaryKey(), // sessionId (uuid)
  cartId: text('cart_id').notNull(),
  orderId: text('order_id').notNull(),
  state: text('state').notNull(), // pending|paid|failed|expired
  chainId: integer('chain_id').notNull(),
  tokenAddress: text('token_address').notNull(),
  amount: text('amount').notNull(), // store as string (wei)
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
