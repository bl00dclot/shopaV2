// src/lib/server/x402.ts
import { createThirdwebClient } from 'thirdweb';
import { facilitator } from 'thirdweb/x402';
// import your chain from thirdweb/chains, e.g.:
import { arbitrum } from 'thirdweb/chains'; // or the chain you actually use
import { env } from '$env/dynamic/private';


const THIRDWEB_SECRET_KEY = env.THIRDWEB_SECRET_KEY;
const SERVER_WALLET_ADDRESS = env.SERVER_WALLET_ADDRESS;

if (!THIRDWEB_SECRET_KEY) {
  console.warn('THIRDWEB_SECRET_KEY is not set. x402 will not work until this is configured.');
}
if (!SERVER_WALLET_ADDRESS) {
  console.warn('SERVER_WALLET_ADDRESS is not set. x402 will not work until this is configured.');
}

export const thirdwebClient = THIRDWEB_SECRET_KEY
  ? createThirdwebClient({
      secretKey: THIRDWEB_SECRET_KEY,
    })
  : null;



export const thirdwebFacilitator = thirdwebClient && SERVER_WALLET_ADDRESS
  ? facilitator({
      client: thirdwebClient,
      serverWalletAddress: SERVER_WALLET_ADDRESS,
    })
  : null;

// Re-export the chain used for settlePayment
export const x402Network = arbitrum; // TODO: swap to your real chain