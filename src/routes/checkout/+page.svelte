<script lang="ts">
	import type { PageProps } from './$types';
	import {
		A,
		Button,
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
	import { getWalletContext } from '$lib/wallet/walletContext.svelte';
	import WalletConnectModal from '$lib/components/WalletConnectModal.svelte';
	const walletContext = getWalletContext();
	let showWalletModal = $state(false);

	// Directly access the $state rune - it's automatically reactive!
	const walletState = $derived(walletContext.state);

	async function handleCheckoutSubmit(event: Event) {
		event.preventDefault();

		// Check if wallet is fully connected (connected AND has publicKey)
		const publicKey = walletState.publicKey;
		if (!walletState.connected || !publicKey) {
			// Show wallet connection modal
			showWalletModal = true;
			return;
		}

		// Proceed with checkout
		// publicKey is guaranteed to be non-null here
		// await processCheckout(publicKey.toString());
		return;
	}

	function handleWalletConnected(publicKey: string, walletName: string) {
		showWalletModal = false;
		// Automatically proceed with checkout after wallet connection
		processCheckout(publicKey);
	}

	async function processCheckout(walletAddress: string) {
		// Your checkout logic here
		// You can use walletAddress for payment processing
		console.log('Processing checkout with wallet:', walletAddress);
	}
	let { data }: PageProps = $props();
</script>

<Table>
	<TableHead>
		<TableHeadCell>Product name</TableHeadCell>
		<TableHeadCell>Quantity</TableHeadCell>
		<TableHeadCell>Colour</TableHeadCell>
		<TableHeadCell>Price</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.cart as item}
			<TableBodyRow>
				<TableBodyCell>{item.product.name}</TableBodyCell>
				<TableBodyCell>{item.quantity}</TableBodyCell>
				<TableBodyCell>{item.product.id}</TableBodyCell>
				<TableBodyCell>{item.product.price}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

{#if walletState.connected}
	<A href="/checkout/form">
		<Button>Proceed</Button>
	</A>
{:else}
	<Button onclick={handleCheckoutSubmit}>Connect Wallet to Proceed</Button>
{/if}

<WalletConnectModal bind:open={showWalletModal} onWalletConnected={handleWalletConnected} />
