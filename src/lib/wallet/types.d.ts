// Type declarations for Solana wallet providers

interface Window {
	solana?: {
		isPhantom?: boolean;
		isConnected?: boolean;
		publicKey?: { toString(): string };
		connect(): Promise<{ publicKey: { toString(): string } }>;
		disconnect(): Promise<void>;
		on(event: string, callback: (...args: any[]) => void): void;
		off(event: string, callback: (...args: any[]) => void): void;
	};
	solflare?: {
		connect(): Promise<void>;
		disconnect(): Promise<void>;
		publicKey?: { toString(): string };
		on(event: string, callback: (...args: any[]) => void): void;
		off(event: string, callback: (...args: any[]) => void): void;
	};
	backpack?: {
		connect(): Promise<void>;
		disconnect(): Promise<void>;
		publicKey?: { toString(): string };
		on(event: string, callback: (...args: any[]) => void): void;
		off(event: string, callback: (...args: any[]) => void): void;
	};
}

interface ImportMetaEnv {
	readonly PUBLIC_SOLANA_RPC_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
