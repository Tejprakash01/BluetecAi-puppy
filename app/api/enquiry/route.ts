import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryValues } from "@/lib/validate";

/**
 * Receives enquiries from the puppy page and the contact "letter".
 * Validates server-side and returns { ok: true }. In a real deployment this is where
 * you would forward to email / CRM / WhatsApp Business API (kept out of scope for the clone).
 */
export async function POST(req: Request) {
  let body: EnquiryValues;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // honeypot: bots fill every field — pretend success, store nothing
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const clean = {
    name: String(body.name).slice(0, 80),
    phone: String(body.phone).slice(0, 30),
    email: body.email ? String(body.email).slice(0, 120) : undefined,
    area: body.area ? String(body.area).slice(0, 80) : undefined,
    puppyId: body.puppyId ? String(body.puppyId).slice(0, 80) : undefined,
    message: body.message ? String(body.message).slice(0, 2000) : undefined,
    receivedAt: new Date().toISOString(),
  };
  console.log("[enquiry]", JSON.stringify(clean));

  return NextResponse.json({ ok: true });
}
