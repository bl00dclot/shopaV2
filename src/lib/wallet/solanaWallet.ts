import { Connection, PublicKey } from '@solana/web3.js';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export interface WalletState {
	connected: boolean;
	publicKey: PublicKey | null;
	walletName: string | null;
	connecting: boolean;
	error: string | null;
}

export interface WalletContext {
	state: WalletState;
	connect: (walletName: string) => Promise<void>;
	disconnect: () => Promise<void>;
	selectWallet: (walletName: string) => void;
}

// Solana RPC endpoint - you can make this configurable
function getRpcEndpoint(): string {
	if (typeof window !== 'undefined' && (window as any).__SOLANA_RPC_URL) {
		return (window as any).__SOLANA_RPC_URL;
	}
	// Try to get from import.meta.env if available
	try {
		const env = (import.meta as any)?.env;
		if (env?.PUBLIC_SOLANA_RPC_URL) {
			return env.PUBLIC_SOLANA_RPC_URL;
		}
	} catch {
		// Ignore if import.meta is not available
	}
	return 'https://api.mainnet-beta.solana.com';
}

const RPC_ENDPOINT = getRpcEndpoint();

export function createSolanaConnection(): Connection {
	return new Connection(RPC_ENDPOINT, 'confirmed');
}

// Detect available wallets
export function detectWallets(): string[] {
	const wallets: string[] = [];
	
	// Check for Phantom
	if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
		wallets.push('Phantom');
	}
	
	// Check for Solflare
	if (typeof window !== 'undefined' && (window as any).solflare) {
		wallets.push('Solflare');
	}
	
	// Check for Backpack
	if (typeof window !== 'undefined' && (window as any).backpack) {
		wallets.push('Backpack');
	}
	
	return wallets;
}

// Connect to Phantom wallet
export async function connectPhantom(): Promise<{ publicKey: PublicKey; walletName: string }> {
	if (typeof window === 'undefined' || !(window as any).solana?.isPhantom) {
		throw new Error('Phantom wallet not found. Please install Phantom extension.');
	}
	
	const provider = (window as any).solana;
	
	if (provider.isConnected) {
		return {
			publicKey: new PublicKey(provider.publicKey.toString()),
			walletName: 'Phantom'
		};
	}
	
	try {
		const response = await provider.connect();
		return {
			publicKey: new PublicKey(response.publicKey.toString()),
			walletName: 'Phantom'
		};
	} catch (error: any) {
		if (error.code === 4001) {
			throw new Error('User rejected the connection request.');
		}
		throw new Error(`Failed to connect to Phantom: ${error.message}`);
	}
}

// Connect to Solflare wallet
export async function connectSolflare(): Promise<{ publicKey: PublicKey; walletName: string }> {
	if (typeof window === 'undefined' || !(window as any).solflare) {
		throw new Error('Solflare wallet not found. Please install Solflare extension.');
	}
	
	const provider = (window as any).solflare;
	
	try {
		await provider.connect();
		return {
			publicKey: new PublicKey(provider.publicKey.toString()),
			walletName: 'Solflare'
		};
	} catch (error: any) {
		if (error.code === 4001) {
			throw new Error('User rejected the connection request.');
		}
		throw new Error(`Failed to connect to Solflare: ${error.message}`);
	}
}

// Connect to Backpack wallet
export async function connectBackpack(): Promise<{ publicKey: PublicKey; walletName: string }> {
	if (typeof window === 'undefined' || !(window as any).backpack) {
		throw new Error('Backpack wallet not found. Please install Backpack extension.');
	}
	
	const provider = (window as any).backpack;
	
	try {
		await provider.connect();
		return {
			publicKey: new PublicKey(provider.publicKey.toString()),
			walletName: 'Backpack'
		};
	} catch (error: any) {
		if (error.code === 4001) {
			throw new Error('User rejected the connection request.');
		}
		throw new Error(`Failed to connect to Backpack: ${error.message}`);
	}
}

// Generic connect function
export async function connectWallet(walletName: string): Promise<{ publicKey: PublicKey; walletName: string }> {
	switch (walletName) {
		case 'Phantom':
			return connectPhantom();
		case 'Solflare':
			return connectSolflare();
		case 'Backpack':
			return connectBackpack();
		default:
			throw new Error(`Unsupported wallet: ${walletName}`);
	}
}

// Disconnect wallet
export async function disconnectWallet(walletName: string): Promise<void> {
	if (typeof window === 'undefined') return;
	
	try {
		switch (walletName) {
			case 'Phantom':
				if ((window as any).solana?.isPhantom) {
					await (window as any).solana.disconnect();
				}
				break;
			case 'Solflare':
				if ((window as any).solflare) {
					await (window as any).solflare.disconnect();
				}
				break;
			case 'Backpack':
				if ((window as any).backpack) {
					await (window as any).backpack.disconnect();
				}
				break;
		}
	} catch (error) {
		console.error(`Error disconnecting ${walletName}:`, error);
	}
}

