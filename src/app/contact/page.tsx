export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">Let’s Work Together</h1>

      <p className="mb-8 text-gray-600">
        Interested in collaborating or hiring me? Let’s talk.
      </p>

      <a
        href="mailto:yourname@email.com"
        className="inline-block rounded-xl bg-primary px-6 py-3 text-white hover:bg-accent transition"
      >
        Contact Me
      </a>
    </section>
  );
}
