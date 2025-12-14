<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { getWalletContext } from '../wallet/walletContext.svelte';
	import WalletConnectModal from './WalletConnectModal.svelte';
	
	interface Props {
		onWalletConnected?: (publicKey: string, walletName: string) => void;
	}
	
	let { onWalletConnected }: Props = $props();
	
	const walletContext = getWalletContext();
	let showModal = $state(false);
	
	// Directly access the $state rune - it's automatically reactive!
	const walletState = $derived(walletContext.state);
	
	function handleConnect() {
		if (walletState.connected) {
			walletContext.disconnect();
		} else {
			showModal = true;
		}
	}
	
	function handleWalletConnected(publicKey: string, walletName: string) {
		onWalletConnected?.(publicKey, walletName);
		showModal = false;
	}
	
	function formatAddress(address: string): string {
		if (address.length <= 8) return address;
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
</script>

<Button
	onclick={handleConnect}
	color={walletState.connected ? "green" : "blue"}
	class="flex items-center gap-2"
>
	{#if walletState.connecting}
		<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		Connecting...
	{:else if walletState.connected && walletState.publicKey}
		<span>✓ {walletState.walletName}</span>
		<span class="text-xs opacity-75">({formatAddress(walletState.publicKey.toString())})</span>
	{:else}
		Connect Wallet
	{/if}
</Button>

<WalletConnectModal bind:open={showModal} {onWalletConnected} />

