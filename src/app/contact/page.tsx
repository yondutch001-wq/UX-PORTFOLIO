export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <section className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Tell me about your product goals.
          </h1>
          <p className="mt-4 text-muted">
            Share a quick overview and I will reply within 48 hours. I support
            discovery sprints, UX/UI redesigns, and scalable design systems.
          </p>

          <div className="mt-8 space-y-4">
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Email</p>
              <a
                href="mailto:hello@dvtch.studio"
                className="mt-2 inline-block text-lg font-semibold text-ink"
              >
                hello@dvtch.studio
              </a>
            </div>
            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Availability</p>
              <p className="mt-2 text-sm text-muted">
                Booking select design sprints and product engagements.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <p className="eyebrow">Project Inquiry</p>
          <form
            className="mt-6 grid gap-4"
            action="mailto:hello@dvtch.studio"
            method="post"
            encType="text/plain"
          >
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
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
