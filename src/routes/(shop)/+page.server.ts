import { getAllProducts } from '$lib/server/services/product.service';
import type { PageServerLoad } from '../(shop)/$types';

export const load: PageServerLoad = async () => {
  const products = (await getAllProducts());
  return products
};