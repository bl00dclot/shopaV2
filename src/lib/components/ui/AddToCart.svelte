<script lang=ts>
    import { Button } from "flowbite-svelte";
    import { addToCart } from "$lib/client/cart.svelte";
    import { cartOpen } from "$lib/client/cartState.svelte";
        let { data } = $props();
    const add = (id: string, quantity = 1) => {
        addToCart(id, quantity);
        $cartOpen = true;
    }
</script>

<Button onclick={()=>{add(data.id, data.quantity)}}>Add to Cart</Button>