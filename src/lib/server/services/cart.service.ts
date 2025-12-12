import type { Product } from "$lib/types/Product";
import { getSpecificProductsById } from "./product.service";

export async function getCartProducts(ids: string[]): Promise<Map<string, Product>>{
    const rows = await getSpecificProductsById(ids);
    const map = new Map<string, Product>();
    rows.forEach(row => {
        map.set(row.id, row);
    });
    return map;
}