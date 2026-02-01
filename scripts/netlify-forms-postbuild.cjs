const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), '.next', 'static');
if (!fs.existsSync(outputDir)) {
  console.warn('Missing .next/static; skipping netlify forms inject.');
  process.exit(0);
}
const outFile = path.join(outputDir, 'netlify-forms.html');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Netlify Forms</title>
  </head>
  <body>
    <form name="contact" method="POST" action="/contact/thanks" data-netlify="true" data-netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact" />
      <p style="display: none;">
        <label>Don't fill this out: <input name="bot-field" /></label>
      </p>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <input type="text" name="project" />
      <textarea name="message"></textarea>
    </form>
  </body>
</html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outFile, html, 'utf8');
console.log(`Wrote ${path.relative(process.cwd(), outFile)}`);
