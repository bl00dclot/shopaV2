<script lang="ts">
	import { Modal, Button, P } from 'flowbite-svelte';
	import { getWalletContext } from '$lib/wallet/walletContext.svelte';
	import { detectWallets } from '$lib/wallet/solanaWallet';
	
	interface Props {
		open?: boolean;
		onWalletConnected?: (publicKey: string, walletName: string) => void;
	}
	
	let { open = $bindable(false), onWalletConnected }: Props = $props();
	
	const walletContext = getWalletContext();
	const availableWallets = $derived(detectWallets());
	
	// Directly access the $state rune - it's automatically reactive!
	const connecting = $derived(walletContext.state.connecting);
	const error = $derived(walletContext.state.error);
	
	async function handleConnect(walletName: string) {
		try {
			await walletContext.connect(walletName);
			// Access state directly - it's reactive
			if (walletContext.state.connected && walletContext.state.publicKey) {
				onWalletConnected?.(
					walletContext.state.publicKey.toString(), 
					walletContext.state.walletName || walletName
				);
				open = false;
			}
		} catch (err: any) {
			console.error('Connection error:', err);
		}
	}
	
	const walletIcons: Record<string, string> = {
		Phantom: '👻',
		Solflare: '🔥',
		Backpack: '🎒'
	};
</script>

<Modal bind:open title="Connect Wallet" size="xs">
	<P class="text-sm font-normal text-gray-500 dark:text-gray-400">
		Connect with one of our available Solana wallet providers to proceed with checkout.
	</P>
	
	{#if error}
		<div class="my-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
			{error}
		</div>
	{/if}
	
	<ul class="my-4 space-y-3">
		{#each availableWallets as walletName (walletName)}
			<li>
				<button
					type="button"
					onclick={() => handleConnect(walletName)}
					disabled={connecting}
					class="group flex w-full items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow-sm dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				>
					<span class="text-2xl me-3">{walletIcons[walletName] || '💼'}</span>
					<span class="flex-1 text-left">{walletName}</span>
					{#if connecting}
						<svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{/if}
				</button>
			</li>
		{/each}
		
		{#if availableWallets.length === 0}
			<li>
				<div class="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
					<p class="font-semibold mb-2">No wallets detected</p>
					<p>Please install a Solana wallet extension to continue:</p>
					<ul class="mt-2 list-disc list-inside space-y-1">
						<li><a href="https://phantom.app/" target="_blank" rel="noopener" class="underline">Phantom</a></li>
						<li><a href="https://solflare.com/" target="_blank" rel="noopener" class="underline">Solflare</a></li>
						<li><a href="https://www.backpack.app/" target="_blank" rel="noopener" class="underline">Backpack</a></li>
					</ul>
				</div>
			</li>
		{/if}
	</ul>
	
	<div class="text-xs text-gray-500 dark:text-gray-400">
		<p>By connecting a wallet, you agree to our Terms of Service and Privacy Policy.</p>
	</div>
</Modal>

