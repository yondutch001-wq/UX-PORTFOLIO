import ContactForm from "@/components/forms/contact-form";

type Props = {
  searchParams?: { project?: string };
};

export default function ContactPage({ searchParams }: Props) {
  const projectValue = searchParams?.project ?? "";

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
                href="mailto:dvtchii@gmail.com"
                className="mt-2 inline-block text-lg font-semibold text-ink"
              >
                dvtchii@gmail.com
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

        <ContactForm projectValue={projectValue} />
      </section>
    </main>
  );
}
