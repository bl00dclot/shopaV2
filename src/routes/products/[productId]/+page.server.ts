import { getProductById } from "$lib/server/services/product.service";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = async ({params}) => {
    const product = await getProductById(params.productId);
    return { product };
}