export const dynamic = "force-static";

export default function NetlifyFormsPage() {
  return (
    <main>
      <form
        name="contact"
        method="POST"
        action="/contact/thanks"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p style={{ display: "none" }}>
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="project" />
        <textarea name="message" />
      </form>
    </main>
  );
}
