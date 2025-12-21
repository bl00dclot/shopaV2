import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
    return json({ ok: true })
}