import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/contact-schema";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;
  if (website && website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
      });
    } catch (e) {
      console.error("Contact webhook failed:", e);
      return NextResponse.json(
        { error: "Impossible d'envoyer le message pour le moment." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[contact]", data);
  } else {
    console.error("[contact] CONTACT_WEBHOOK_URL is not set — submission discarded:", data);
    return NextResponse.json(
      { error: "Service de contact non configuré." },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
