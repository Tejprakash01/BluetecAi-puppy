"use client";

import { useState } from "react";

import { validateEnquiry, type EnquiryValues, type FieldErrors } from "@/lib/validate";

export type { EnquiryValues, FieldErrors };

export function useEnquiry() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function submit(form: HTMLFormElement): Promise<boolean> {
    const values = Object.fromEntries(new FormData(form)) as unknown as EnquiryValues;
    const errs = validateEnquiry(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return false;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return false;
      }
      setStatus("sent");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }

  return { status, errors, submit };
}
