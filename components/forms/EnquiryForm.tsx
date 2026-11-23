"use client";

import { useId } from "react";
import { site } from "@/lib/data/site";
import { useEnquiry } from "./useEnquiry";

function Field({
  label,
  name,
  required,
  hint,
  error,
  ...input
}: { label: string; name: string; required?: boolean; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {required ? <span className="text-toffee-ink"> *</span> : <span className="font-normal text-cocoa-soft"> (optional)</span>}
      </label>
      <input id={id} name={name} required={required} aria-invalid={!!error} aria-describedby={hint || error ? `${id}-hint` : undefined} className="tp-field" {...input} />
      {(error || hint) && (
        <p id={`${id}-hint`} className={`mt-1 text-sm ${error ? "font-semibold text-[#b3261e]" : "text-cocoa-soft"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/** "Ask about Max" — enquiry form on each puppy page. */
export function EnquiryForm({ puppyId, puppyLabel }: { puppyId: string; puppyLabel: string }) {
  const { status, errors, submit } = useEnquiry();
  const msgId = useId();

  if (status === "sent") {
    return (
      <div className="tp-post__sent" role="status" tabIndex={-1}>
        <p className="font-plush text-[2rem]">Thank you! 🐾</p>
        <p className="mx-auto mt-2 max-w-[36ch]">We&apos;ve got your enquiry about {puppyLabel} and will get back to you very soon. For the quickest reply, message us on WhatsApp.</p>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
          Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" minLength={2} maxLength={80} error={errors.name} />
        <Field label="Phone or WhatsApp" name="phone" required type="tel" inputMode="tel" autoComplete="tel" hint="With country code, e.g. +971 50 123 4567" error={errors.phone} />
        <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field label="Your area" name="area" autoComplete="address-level2" maxLength={80} hint="e.g. Dubai Marina" />
      </div>
      <input type="hidden" name="puppyId" value={puppyId} />
      <div>
        <label htmlFor={msgId} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea id={msgId} name="message" rows={4} maxLength={2000} className="tp-field" defaultValue={`Hi! I'd love to know more about ${puppyLabel}.`} />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>
      {status === "error" && !Object.keys(errors).length && (
        <p className="tp-letterform__alert" role="alert">
          Something went wrong sending that — please try again, or message us on WhatsApp.
        </p>
      )}
      <button type="submit" className="btn btn-primary w-full disabled:opacity-70 sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
