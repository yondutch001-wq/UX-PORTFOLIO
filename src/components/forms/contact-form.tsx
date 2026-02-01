"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const FORM_ACTION = "/__forms.html";

type Props = {
  projectValue: string;
};

function encodeForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const params = new URLSearchParams();
  for (const [key, value] of data.entries()) {
    params.append(key, String(value));
  }
  return params.toString();
}

export default function ContactForm({ projectValue }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");

    const form = event.currentTarget;
    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(form)
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      router.push("/contact/thanks");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card p-8">
      <p className="eyebrow">Project Inquiry</p>
      <form
        className="mt-6 grid gap-4"
        name="contact"
        method="POST"
        action="/contact/thanks"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>
        <div className="grid gap-2">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-[0.2em] text-muted"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.2em] text-muted"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="project"
            className="text-xs uppercase tracking-[0.2em] text-muted"
          >
            Project Type
          </label>
          <input
            id="project"
            name="project"
            type="text"
            defaultValue={projectValue}
            placeholder="Mobile app, SaaS, redesign"
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="message"
            className="text-xs uppercase tracking-[0.2em] text-muted"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell me about your goals, timelines, and challenges."
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-ink"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Inquiry"}
        </button>
        {status === "error" ? (
          <p className="text-sm text-rose-500">Something went wrong. Please try again.</p>
        ) : null}
      </form>
    </div>
  );
}
