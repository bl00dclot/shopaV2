<script>
	import { addToCart } from "$lib/client/cart.svelte.js";
    import { Button, ButtonGroup, Badge, Rating, Accordion, AccordionItem } from "flowbite-svelte";
    import { ShoppingBagSolid, HeartSolid } from "flowbite-svelte-icons";
    
    
    // Product state
    let selectedColor = $state("gray");
    let selectedSize = $state("M");
    let quantity = $state(1);
    
    const colors = [
        { name: "gray", class: "bg-gray-800 dark:bg-gray-200" },
        { name: "red", class: "bg-red-500 dark:bg-red-700" },
        { name: "blue", class: "bg-blue-500 dark:bg-blue-700" },
        { name: "yellow", class: "bg-yellow-500 dark:bg-yellow-700" }
    ];
    
    const sizes = ["S", "M", "L", "XL", "XXL"];
    
    // function addToCart() {
    //     alert(`Added to cart: Size ${selectedSize}, Color ${selectedColor}, Quantity ${quantity}`);
    // }
    
    function addToWishlist() {
        alert("Added to wishlist!");
    }
        let { data } = $props();
        let product = data.product[0];
        

</script>

<div class="bg-gray-100 dark:bg-gray-800 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Product Image Section -->
            <div class="md:flex-1">
                <div class="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4 overflow-hidden">
                    <img 
                        class="w-full h-full object-cover" 
                        src="/product.webp" 
                        alt="Premium product mockup"
                    />
                </div>
                <div class="flex gap-4">
                    <!-- <div class="flex-1">
                        <Button onclick={()=> addToCart(product.id)} size="lg" class="w-full">
                            <ShoppingBagSolid class="w-5 h-5 me-2" />
                            Add to Cart
                        </Button>
                    </div> -->
                    <div class="flex-1">
                        <Button onclick={addToWishlist} color="light" size="lg" class="w-full">
                            <HeartSolid class="w-5 h-5 me-2" />
                            Wishlist
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Product Details Section -->
            <div class="md:flex-1">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h2>
                
                <!-- Rating -->
                <div class="mb-4">
                    <Rating total={5} rating={4.5} id="product-rating">
                        {#snippet text()}
                            <p class="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                4.5 out of 5
                            </p>
                        {/snippet}
                    </Rating>
                    <a href="#reviews" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        (128 reviews)
                    </a>
                </div>

                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {product.description}
                </p>

                <!-- Price and Availability -->
                <div class="flex items-center gap-6 mb-6">
                    <div>
                        <span class="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                        <span class="text-2xl font-bold text-gray-900 dark:text-white ml-2">{product.price}</span>
                    </div>
                    <div>
                        <span class="font-bold text-gray-700 dark:text-gray-300 mr-2">Availability:</span>
                        <Badge color="green" large>{product.inStock}</Badge>
                    </div>
                </div>

                <!-- Color Selection -->
                <div class="mb-6">
                    <span class="font-bold text-gray-700 dark:text-gray-300 block mb-3">Select Color:</span>
                    <div class="flex items-center gap-3">
                        {#each colors as color (color.name)}
                            <button
                                onclick={() => selectedColor = color.name}
                                class="w-8 h-8 rounded-full {color.class} transition-all duration-200 {selectedColor === color.name ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'}"
                                aria-label={`Select ${color.name} color`}
                            ></button>
                        {/each}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Selected: <span class="capitalize font-medium">{selectedColor}</span>
                    </p>
                </div>

                <!-- Size Selection -->
                <div class="mb-6">
                    <span class="font-bold text-gray-700 dark:text-gray-300 block mb-3">Select Size:</span>
                    <ButtonGroup>
                        {#each sizes as size (size)}
                            <Button 
                                onclick={() => selectedSize = size}
                                color={selectedSize === size ? "blue" : "light"}
                                class="min-w-[60px]"
                            >
                                {size}
                            </Button>
                        {/each}
                    </ButtonGroup>
                </div>

                <!-- Quantity Selector -->
                <div class="mb-6">
                    <span class="font-bold text-gray-700 dark:text-gray-300 block mb-3">Quantity:</span>
                    <div class="flex items-center gap-3">
                        <Button 
                            onclick={() => quantity = Math.max(1, quantity - 1)}
                            size="sm"
                            color="light"
                        >
                            -
                        </Button>
                        <span class="text-lg font-semibold text-gray-900 dark:text-white min-w-10 text-center">
                            {quantity}
                        </span>
                        <Button 
                            onclick={() => quantity = Math.min(99, quantity + 1)}
                            size="sm"
                            color="light"
                        >
                            +
                        </Button>
                    </div>
                </div>

                <!-- Product Description Accordion -->
                <Accordion>
                    <AccordionItem open>
                        {#snippet header()}
                            <span class="font-bold">Product Description</span>
                        {/snippet}
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. 
                            Integer euismod libero id mauris malesuada tincidunt. Vivamus commodo nulla ut 
                            lorem rhoncus aliquet.
                        </p>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                            Duis dapibus augue vel ipsum pretium, et venenatis sem blandit. Quisque ut erat 
                            vitae nisi ultrices placerat non eget velit. Integer ornare mi sed ipsum lacinia, 
                            non sagittis mauris blandit.
                        </p>
                    </AccordionItem>
                    
                    <AccordionItem>
                        {#snippet header()}
                            <span class="font-bold">Specifications</span>
                        {/snippet}
                        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                            <li>Material: 100% Premium Cotton</li>
                            <li>Weight: 250g</li>
                            <li>Care: Machine washable</li>
                            <li>Origin: Made in USA</li>
                        </ul>
                    </AccordionItem>
                    
                    <AccordionItem>
                        {#snippet header()}
                            <span class="font-bold">Shipping & Returns</span>
                        {/snippet}
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            Free shipping on orders over $50. Standard delivery takes 3-5 business days.
                        </p>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                            30-day return policy. Items must be unused and in original packaging.
                        </p>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </div>
</div>