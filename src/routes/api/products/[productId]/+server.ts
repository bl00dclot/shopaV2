import { getProductById } from "$lib/server/services/product.service";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
if(!params.productId){
    return new Response('Product ID required', {status: 400});
}

  const product = await getProductById(params.productId);
  
  if (!product) {
    return json({ error: 'Not found' }, { status: 404 });
  }
  
  return json(product);
};