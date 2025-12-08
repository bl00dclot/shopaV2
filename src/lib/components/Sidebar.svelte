<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem, SidebarButton, uiHelpers } from "flowbite-svelte";
  import { ChartOutline, GridSolid, MailBoxSolid, UserSolid } from "flowbite-svelte-icons";
  import { page } from "$app/state";
  let activeUrl = $state(page.url.pathname);
  // import PlusPlaceholder from "$utils/";
  const spanClass = "flex-1 ms-3 whitespace-nowrap";
  const demoSidebarUi = uiHelpers();
  let isDemoOpen = $state(false);
  const closeDemoSidebar = demoSidebarUi.close;
  $effect(() => {
    isDemoOpen = demoSidebarUi.isOpen;
    activeUrl = page.url.pathname;
  });
</script>

<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
<div class="relative">
  <Sidebar
    {activeUrl}
    backdrop={false}
    isOpen={isDemoOpen}
    closeSidebar={closeDemoSidebar}
    params={{ x: -50, duration: 50 }}
    class="z-50 h-full"
    position="absolute"
    classes={{ nonactive: "p-2", active: "p-2" }}
  >
    <SidebarGroup>
      <SidebarItem label="Dashboard" href="/">
        {#snippet icon()}
          <ChartOutline class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        {/snippet}
      </SidebarItem>
      <SidebarItem label="Kanban" {spanClass} href="/">
        {#snippet icon()}
          <GridSolid class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        {/snippet}
        {#snippet subtext()}
          <span class="ms-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">Pro</span>
        {/snippet}
      </SidebarItem>
      <SidebarItem label="Inbox" {spanClass} href="/">
        {#snippet icon()}
          <MailBoxSolid class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        {/snippet}
        {#snippet subtext()}
          <span class="bg-primary-200 text-primary-600 dark:bg-primary-900 dark:text-primary-200 ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full p-3 text-sm font-medium">3</span>
        {/snippet}
      </SidebarItem>
      <SidebarItem label="Sidebar" href="/components/sidebar">
        {#snippet icon()}
          <UserSolid class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        {/snippet}
      </SidebarItem>
    </SidebarGroup>
  </Sidebar>
</div>
<!-- src/lib/components/CartSidebar.svelte
<script lang="ts">
  import { Sidebar, SidebarGroup, SidebarItem } from 'flowbite-svelte';
  import { ShoppingBagSolid, TrashBinSolid } from 'flowbite-svelte-icons';
  import { getCartItems, removeFromCart, updateQuantity, clearCart, cartCount, isEmpty } from '$lib/client/cart.svelte';
  
  interface Product {
    id: string,
    name: string,
    image: string,
    price: string,
    inStock: string,
  }

  interface Props {
    isOpen: boolean;
    closeSidebar: () => void;
  }

  type EnrichedItem = {
  id: string;
  quantity: number;
  product: Product; // or a proper Product type
};
  
  let { isOpen, closeSidebar }: Props = $props();
  
  const cartItems = $derived(getCartItems());
let enrichedItems = $state<EnrichedItem[]>([]);

// $effect(() => {
//   (async () => {
//     const items = await Promise.all(
//       cartItems.map(async item => {
//         const res = await fetch(`/api/products/${item.id}`);
//         const product = await res.json();
//         return { ...item, product };
//       })
//     );
//     enrichedItems = items;
//   })();
// });
  
  const total = $derived(
    enrichedItems.reduce((sum, item) => 
      sum + (Number(item.product?.price) || 0) * item.quantity, 0
    )
  );
</script>

<Sidebar 
  {isOpen} 
  {closeSidebar}
  position="fixed"
  backdrop={true}
  class="right-0 top-0 h-full w-80 z-50"
  params={{ x: 320, duration: 300 }}
>
  <div class="p-4 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <ShoppingBagSolid class="w-6 h-6" />
        Cart ({cartCount})
      </h2>
      <button onclick={closeSidebar} class="text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>

    {#if isEmpty()}
      <div class="flex-1 flex items-center justify-center text-gray-500">
        Your cart is empty
      </div>
    {:else}
      <div class="flex-1 overflow-y-auto">
        <SidebarGroup>
          {#each enrichedItems as item (item.id)}
            {@const product = item.product}
            {#if product}
              <div class="p-2 border-b">
                <div class="flex gap-2">
                  <img src={product.image} alt={product.name} class="w-16 h-16 object-cover rounded" />
                  <div class="flex-1">
                    <h3 class="font-medium text-sm">{product.name}</h3>
                    <p class="text-sm text-gray-600">${product.price}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onchange={(e) => updateQuantity(item.id, +(e.target as HTMLInputElement).value)}
                        class="w-16 px-2 py-1 text-sm border rounded"
                      />
                      <button 
                        onclick={() => removeFromCart(item.id)}
                        class="text-red-600 hover:text-red-800"
                      >
                        <TrashBinSolid class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        </SidebarGroup>
      </div>

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between mb-2">
          <span class="font-bold">Total:</span>
          <span class="font-bold">${total.toFixed(2)}</span>
        </div>
        <button 
          onclick={clearCart}
          class="w-full mb-2 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Clear Cart
        </button>
        <button 
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>
    {/if}
  </div>
</Sidebar> -->