import { setContext, getContext } from 'svelte';
import type { PublicKey } from '@solana/web3.js';
import { connectWallet, disconnectWallet, detectWallets, type WalletState } from './solanaWallet';

const WALLET_CONTEXT_KEY = Symbol('wallet-context');

export interface WalletContextValue {
	state: WalletState; // This is now a $state rune, directly reactive
	connect: (walletName: string) => Promise<void>;
	disconnect: () => Promise<void>;
	getAvailableWallets: () => string[];
}

function createWalletContext(): WalletContextValue {
	const initialState: WalletState = {
		connected: false,
		publicKey: null,
		walletName: null,
		connecting: false,
		error: null
	};
	
	// Use $state rune instead of writable store
	const state = $state<WalletState>({ ...initialState });
	
	async function connect(walletName: string): Promise<void> {
		state.connecting = true;
		state.error = null;
		
		try {
			const result = await connectWallet(walletName);
			state.connected = true;
			state.publicKey = result.publicKey;
			state.walletName = result.walletName;
			state.connecting = false;
			state.error = null;
			
			// Listen for disconnect events
			if (typeof window !== 'undefined') {
				const provider = getProviderForWallet(walletName);
				if (provider) {
					provider.on('disconnect', () => {
						Object.assign(state, initialState);
					});
					
					provider.on('accountChanged', (publicKey: PublicKey) => {
						if (publicKey) {
							state.publicKey = publicKey;
						} else {
							Object.assign(state, initialState);
						}
					});
				}
			}
		} catch (error: any) {
			state.connecting = false;
			state.error = error.message || 'Failed to connect wallet';
			throw error;
		}
	}
	
	async function disconnect(): Promise<void> {
		if (state.walletName) {
			await disconnectWallet(state.walletName);
		}
		Object.assign(state, initialState);
	}
	
	function getAvailableWallets(): string[] {
		return detectWallets();
	}
	
	function getProviderForWallet(walletName: string): any {
		if (typeof window === 'undefined') return null;
		
		switch (walletName) {
			case 'Phantom':
				return (window as any).solana;
			case 'Solflare':
				return (window as any).solflare;
			case 'Backpack':
				return (window as any).backpack;
			default:
				return null;
		}
	}
	
	return {
		state,
		connect,
		disconnect,
		getAvailableWallets
	};
}

export function setWalletContext(): WalletContextValue {
	const context = createWalletContext();
	setContext(WALLET_CONTEXT_KEY, context);
	return context;
}

export function getWalletContext(): WalletContextValue {
	const context = getContext<WalletContextValue>(WALLET_CONTEXT_KEY);
	if (!context) {
		throw new Error('Wallet context not found. Make sure to wrap your app with WalletProvider.');
	}
	return context;
}
