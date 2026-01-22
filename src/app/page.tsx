export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <section className="mb-24">
        <h1 className="mb-6 text-5xl font-bold leading-tight">
          Designing intuitive digital products that people actually enjoy using.
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-600">
          I’m a UI/UX Designer focused on user-centered design, usability, and
          scalable systems. I translate complex problems into clear, thoughtful
          digital experiences.
        </p>

        <div className="flex gap-4">
          <a
            href="/projects"
            className="rounded-xl bg-primary px-6 py-3 text-white transition hover:bg-accent"
          >
            View Case Studies
          </a>

          <a
            href="/contact"
            className="rounded-xl border px-6 py-3 transition hover:bg-gray-50"
          >
            Contact Me
          </a>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Selected Projects</h2>
        <p className="mb-8 max-w-xl text-gray-600">
          A few projects that showcase my design process, decision-making, and
          problem-solving approach.
        </p>

        <a
          href="/projects"
          className="text-primary underline underline-offset-4"
        >
          See all projects →
        </a>
      </section>
    </main>
  );
}
