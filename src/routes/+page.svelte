<script>
  import Hero from "$lib/components/Hero.svelte";
  import ProductGrid from "$lib/components/ui/ProductGrid.svelte";
  import Testimonial from "$lib/components/Testimonial.svelte";
    import { DarkMode } from "flowbite-svelte";

let { data } = $props();
</script>
<DarkMode />
<Hero />
  <ProductGrid products={ data.allProducts } />
  <Testimonial />
