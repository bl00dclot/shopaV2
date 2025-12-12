<script lang=ts>
    import { Button } from "flowbite-svelte";
    import { addToCart } from "$lib/client/cart.svelte";
    import { drawerOpen } from "$lib/client/drawerState.svelte";
        let { data } = $props();
    const add = (id: string, quantity = 1) => {
        addToCart(id, quantity);
        if(!data.toggleOpen)
        $drawerOpen = true;
    }
</script>

<Button onclick={()=>{add(data.id, data.quantity)}}>Add to Cart</Button>