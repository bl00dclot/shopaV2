import { getAllProducts } from '$lib/server/services/product.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const products = (await getAllProducts());
  return products
};