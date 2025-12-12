<script lang="ts">
	import type { PageProps } from './$types';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let { data }: PageProps = $props();
</script>

<Navbar>
	<NavBrand href="/">
		<img src="/logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Shopa</span>
		<img src="/logo.svg" class="m-3 h-6 sm:h-9" alt="Flowbite Logo" />
	</NavBrand>
	<NavHamburger />
</Navbar>

<Table>
	<TableHead>
		<TableHeadCell>Product name</TableHeadCell>
		<TableHeadCell>Quantity</TableHeadCell>
		<TableHeadCell>Colour</TableHeadCell>
		<TableHeadCell>Price</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.cart as item }
			<TableBodyRow>
				<TableBodyCell>{item.product.name}</TableBodyCell>
				<TableBodyCell>{item.quantity}</TableBodyCell>
				<TableBodyCell>{item.product.id}</TableBodyCell>
				<TableBodyCell>{item.product.price}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
