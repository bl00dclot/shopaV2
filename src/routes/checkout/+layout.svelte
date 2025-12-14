<script lang="ts">
	import { Navbar, NavBrand, NavHamburger } from 'flowbite-svelte';
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>
<Navbar>
	<NavBrand href="/">
		<img src="/logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Shopa</span>
		<img src="/logo.svg" class="m-3 h-6 sm:h-9" alt="Flowbite Logo" />
	</NavBrand>
	<NavHamburger />
</Navbar>
{@render children()}