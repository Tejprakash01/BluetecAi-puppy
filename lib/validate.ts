/** Enquiry validation shared by the browser forms and the /api/enquiry route. */
export type EnquiryValues = {
  name: string;
  phone: string;
  email?: string;
  area?: string;
  puppyId?: string;
  message?: string;
  website?: string; // honeypot — real people leave it empty
};

export type FieldErrors = Partial<Record<keyof EnquiryValues, string>>;

const PHONE = /^\+?[0-9][0-9\s\-()]{6,18}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(v: EnquiryValues): FieldErrors {
  const e: FieldErrors = {};
  if (!v.name || v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!v.phone || !PHONE.test(v.phone.trim())) e.phone = "Please add a phone or WhatsApp number with country code.";
  if (v.email && !EMAIL.test(v.email.trim())) e.email = "That email doesn't look quite right.";
  return e;
}

