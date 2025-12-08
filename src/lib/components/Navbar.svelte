<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import Sidebar from './Sidebar.svelte';
	import Drawer from './Drawer.svelte';
	import IronCross from './icons/IronCross.svelte';
</script>

<Navbar>
	<NavHamburger />
	<NavUl transition={fade} transitionParams={{ duration: 300 }}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
	<NavBrand href="/">
		<img src="/logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Shopa</span>
		<img src="/logo.svg" class="m-3 h-6 sm:h-9" alt="Flowbite Logo" />
	</NavBrand>
	<div class="flex gap-2">
		<DarkMode />
		<Drawer />
	</div>
</Navbar>
