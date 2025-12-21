<script lang=ts>
    import { Button } from "flowbite-svelte";
    import { addToCart } from "$lib/client/cart.svelte";
    import { openCart } from "$lib/client/cartState.svelte";
        let { data } = $props();
    const add = (id: string, quantity = 1, name: string, price: string, image: string) => {
        addToCart({ id, quantity, name, price, image });
        openCart();
    }
</script>

<Button onclick={()=>{add(data.id, data.quantity, data.name, data.price, data.image)}}>Add to Cart</Button>