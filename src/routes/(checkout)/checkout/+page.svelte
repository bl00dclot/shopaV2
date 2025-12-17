<script lang="ts">
	import type { PageProps } from './$types';
	import {
		A,
		Button,
		Card,
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
	import { Label, Input, Checkbox } from 'flowbite-svelte';

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

<form>
	<div class="flex flex-col gap-6 justify-center lg:content-start lg:flex-row">
		<Card size="lg" class="p-4 sm:p-6 md:p-8">
			<div class="mb-6 grid gap-6 md:grid-cols-2">
				<div class="mb-6">
					<Label for="default-input" class="mb-2 block">Default input</Label>
					<Input id="default-input" placeholder="Default input" />
				</div>
				<div class="mb-6">
					<Label for="default-input" class="mb-2 block">Default input</Label>
					<Input id="default-input" placeholder="Default input" />
				</div>
				<div class="mb-6">
					<Label for="email" class="mb-2">Email address</Label>
					<Input type="email" id="email" placeholder="john.doe@company.com" required />
				</div>
				<div class="mb-6">
					<Label for="default-input" class="mb-2 block">Default input</Label>
					<Input id="default-input" placeholder="Default input" />
				</div>
				<div class="mb-6">
					<Label for="number-input">Select a number:</Label>
					<Input
						type="number"
						id="number-input"
						aria-describedby="helper-text-explanation"
						placeholder="90210"
						required
					/>
					<Checkbox classes={{ div: 'mb-6 gap-1 rtl:space-x-reverse' }} required>
						I agree with the <A
							href=""
							class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A
						>.
					</Checkbox>
				</div>
			</div>
		</Card>
		<Card size="md" class="p-4 sm:p-6 md:p-8">
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
		</Card>
	</div>

	{#if walletState.connected}
		<A href="/checkout/form">
			<Button>Proceed</Button>
		</A>
	{:else}
		<Button onclick={handleCheckoutSubmit}>Connect Wallet to Proceed</Button>
	{/if}

	<WalletConnectModal bind:open={showWalletModal} onWalletConnected={handleWalletConnected} />
	<Button type="submit">Submit</Button>
</form>
