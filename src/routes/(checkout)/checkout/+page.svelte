<script lang="ts">
	import type { PageProps } from './$types';
	import {
		A,
		Button,
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Label,
		Input,
		Checkbox,
		Select
	} from 'flowbite-svelte';

	// import { getWalletContext } from '$lib/wallet/walletContext.svelte';
	// import WalletConnectModal from '$lib/components/WalletConnectModal.svelte';
	// const walletContext = getWalletContext();
	// let showWalletModal = $state(false);

	// // Directly access the $state rune - it's automatically reactive!
	// const walletState = $derived(walletContext.state);

	// async function handleCheckoutSubmit(event: Event) {
	// 	event.preventDefault();

	// 	// Check if wallet is fully connected (connected AND has publicKey)
	// 	const publicKey = walletState.publicKey;
	// 	if (!walletState.connected || !publicKey) {
	// 		// Show wallet connection modal
	// 		showWalletModal = true;
	// 		return;
	// 	}

	// 	// Proceed with checkout
	// 	// publicKey is guaranteed to be non-null here
	// 	// await processCheckout(publicKey.toString());
	// 	return;
	// }

	// function handleWalletConnected(publicKey: string, walletName: string) {
	// 	showWalletModal = false;
	// 	// Automatically proceed with checkout after wallet connection
	// 	processCheckout(publicKey);
	// }

	// async function processCheckout(walletAddress: string) {
	// 	// Your checkout logic here
	// 	// You can use walletAddress for payment processing
	// 	console.log('Processing checkout with wallet:', walletAddress);
	// }

	type NetworkId = 'base' | 'polygon' | 'ethereum';

	const networks: Record<
		NetworkId,
		{
			label: string;
			chainId: number;
			tokens: { id: string; label: string; icon: string; tokenAddress: string }[];
		}
	> = {
		base: {
			label: 'Base',
			chainId: 8453,
			tokens: [
				{
					id: 'usdc',
					label: 'USDC',
					icon: '/icons/usdc.svg',
					tokenAddress: '0x...' // TODO: real address
				},
				{
					id: 'eth',
					label: 'ETH',
					icon: '/icons/eth.svg',
					tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
				}
			]
		},
		polygon: {
			label: 'Polygon',
			chainId: 137,
			tokens: [
				{
					id: 'usdc',
					label: 'USDC',
					icon: '/icons/usdc.svg',
					tokenAddress: '0x...' // TODO
				},
				{
					id: 'matic',
					label: 'MATIC',
					icon: '/icons/matic.svg',
					tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
				}
			]
		},
		ethereum: {
			label: 'Ethereum',
			chainId: 1,
			tokens: [
				{
					id: 'usdc',
					label: 'USDC',
					icon: '/icons/usdc.svg',
					tokenAddress: '0x...' // TODO
				},
				{
					id: 'eth',
					label: 'ETH',
					icon: '/icons/eth.svg',
					tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
				}
			]
		}
	};

	let selectedNetworkId = $state<NetworkId | ''>('');
	let selectedTokenId = $state<string | null>(null);

	let loadingQuote = $state(false);
	let quoteError = $state('');
	let totalUsd = $state<number | null>(null);
	let totalToken = $state<string | null>(null);
	let quoteTokenSymbol = $state<string | null>(null);
	let quoteChainName = $state<string | null>(null);

	function resetQuote() {
		loadingQuote = false;
		quoteError = '';
		totalUsd = null;
		totalToken = null;
		quoteTokenSymbol = null;
		quoteChainName = null;
	}

	// function handleNetworkChange(event: Event) {
	// 	const value = (event.target as HTMLSelectElement).value as NetworkId | '';
	// 	selectedNetworkId = value;
	// 	selectedTokenId = null;
	// 	resetQuote();
	// }
	  $effect(() => {
    selectedTokenId; // tracked
    selectedNetworkId; // tracked
    // when network changes, reset token + quote
    // we only care about the network change really:
    resetQuote();
  });

	async function handleTokenClick(id: string) {
		selectedTokenId = id;
		await fetchQuote();
	}

	async function fetchQuote() {
		resetQuote();
		if (!selectedNetworkId || !selectedTokenId) return;

		const net = networks[selectedNetworkId];
		const token = net.tokens.find((t) => t.id === selectedTokenId);
		if (!token) return;

		loadingQuote = true;
		try {
			const res = await fetch('/api/payments/quote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chainId: net.chainId,
					tokenAddress: token.tokenAddress
				})
			});

			if (!res.ok) {
				quoteError = `Quote failed (${res.status})`;
				return;
			}

			const data = await res.json();
			totalUsd = data.totalUsd;
			totalToken = data.totalToken;
			quoteTokenSymbol = data.tokenSymbol ?? token.label;
			quoteChainName = data.chainName ?? net.label;
		} catch (error) {
			console.error(error);
			quoteError = 'Network error while loading quote';
		} finally {
			loadingQuote = false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!selectedNetworkId || !selectedTokenId) {
			quoteError = 'Please choose a network and token.';
			return;
		}

		const net = networks[selectedNetworkId];
		const token = net.tokens.find((t) => t.id === selectedTokenId);
		if (!token) {
			quoteError = 'Invalid token selection.';
			return;
		}

		// Send to your backend checkout endpoint along with the rest of the form data
		// Example:
		// await fetch('/api/checkout/initialize', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify({
		//     chainId: net.chainId,
		//     tokenAddress: token.tokenAddress,
		//     tokenSymbol: token.label,
		//     // ...other checkout fields...
		//   })
		// });
	}
	let { data }: PageProps = $props();
</script>

<form>
	<div class="flex flex-col gap-6 justify-center lg:content-start lg:flex-row m-2">
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
					<Checkbox classes={{ div: 'mt-3 gap-1 rtl:space-x-reverse' }} required>
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

	<!-- {#if walletState.connected} -->
	<!-- <A href="/checkout/form">
		<Button>Proceed</Button>
	</A> -->
	<!-- {:else} -->
	<!-- <Button onclick={handleCheckoutSubmit}>Connect Wallet to Proceed</Button> -->
	<!-- {/if} -->

	<!-- <WalletConnectModal bind:open={showWalletModal} onWalletConnected={handleWalletConnected} /> -->
	<div class="flex justify-center m-6">
		<Card class="w-full p-6">
		<div class="flex items-center justify-between">
			<h2 class="text-base dark:text-gray-300 font-semibold">Crypto payment</h2>
			<span class="text-xs dark:text-gray-300">Powered by Thirdweb</span>
		</div>

		<div class="space-y-4">
			<div>
				<Label for="network" class="mb-1 block">Network</Label>
				<Select id="network" bind:value={selectedNetworkId}>
					<option value="" disabled hidden>Select a network</option>
					{#each Object.entries(networks) as [id, net]}
						<option value={id}>{net.label}</option>
					{/each}
				</Select>
			</div>

			{#if selectedNetworkId}
				{#if networks[selectedNetworkId].tokens.length > 0}
					<div class="space-y-2">
						<p class="text-sm font-medium dark:text-gray-300">Choose a token</p>
						<div class="grid grid-cols-3 gap-3">
							{#each networks[selectedNetworkId].tokens as opt}
								<Button
									type="button"
									color={selectedTokenId === opt.id ? 'primary' : 'alternative'}
									class="flex flex-col items-center px-3! py-3!"
									onclick={() => handleTokenClick(opt.id)}
								>
									<img src={opt.icon} alt={opt.label} class="w-8 h-8 mb-1" />
									<span class="text-sm font-medium dark:text-gray-300">{opt.label}</span>
								</Button>
							{/each}
						</div>
					</div>
				{:else}
					<p class="text-sm dark:text-gray-300">No tokens available on this network.</p>
				{/if}
			{:else}
				<p class="text-sm dark:text-gray-300">Select a network to see available tokens.</p>
			{/if}

			{#if loadingQuote}
				<p class="text-sm dark:text-gray-300">Calculating price…</p>
			{:else if quoteError}
				<p class="text-sm text-red-600">{quoteError}</p>
			{:else if totalUsd !== null && totalToken !== null && quoteTokenSymbol && quoteChainName}
				<div class="mt-2 rounded-md bg-gray-50 p-3 text-sm">
					<p class="font-medium">You will pay:</p>
					<p class="mt-1">
						<span class="font-semibold">{totalToken} {quoteTokenSymbol}</span>
						<span class="dark:text-gray-300"> (~${totalUsd.toFixed(2)} USD) on {quoteChainName}</span>
					</p>
				</div>
			{/if}
			<Button type="submit">Submit</Button>
		</div>
	</Card>

	</div>
	
</form>
