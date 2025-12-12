import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq, lt, gte, ne, inArray } from 'drizzle-orm';


export async function getAllProducts() {
  const allProducts = await db.select().from(products);

  return { allProducts }
}

export async function getProductById(id: string) {
  const product = await db.select().from(products).where(eq(products.id, id));
  return product
}
export async function getSpecificProductsById(ids: string[]){
  const result = await db.select(
    {
      id: products.id,
      name: products.name,
      price: products.price,
      description: products.description,
      image: products.image,
      inStock: products.inStock,
    }
  ).from(products).where(inArray(products.id, ids));
  return result
}