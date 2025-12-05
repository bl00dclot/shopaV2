import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';


export async function getAllProducts() {
  const allProducts = await db.select().from(products);

  return { allProducts }
}

export async function getProductById(id: string) {
  const product = await db.select().from(products).where(eq(products.id, id));
  return product
}