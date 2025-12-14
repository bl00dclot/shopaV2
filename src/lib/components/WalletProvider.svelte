<script lang="ts">
	import { onMount } from 'svelte';
	import { setWalletContext } from '$lib/wallet/walletContext.svelte';
	const walletContext = setWalletContext();

	// Try to auto-connect if wallet was previously connected
	onMount(async () => {
		if (typeof window !== 'undefined') {
			// Check if Phantom is already connected
			if ((window as any).solana?.isPhantom && (window as any).solana.isConnected) {
				try {
					await walletContext.connect('Phantom');
				} catch (error) {
					console.error('Auto-connect failed:', error);
				}
			}
		}
	});
</script>

<slot />
