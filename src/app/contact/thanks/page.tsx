import Link from "next/link";

export default function ContactThanksPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <section className="card p-8 text-center">
        <p className="eyebrow">Inquiry Sent</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Thanks for reaching out.
        </h1>
        <p className="mt-4 text-muted">
          I have your message and will reply within 48 hours.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
