import type { RequestEvent } from "@sveltejs/kit";

// src/lib/server/cookies.ts
const COOKIE_NAME = 'cart_session';
export const readCartId = (event: RequestEvent) => event.cookies.get(COOKIE_NAME) ?? null;
export const setCartId = (event: RequestEvent, cartId: string) =>
  event.cookies.set(COOKIE_NAME, cartId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
    secure: true,
  });