import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const posters = [
  {
    html: "public/evangilism_ch.html",
    pdf: "public/evangilism_ch.pdf",
    titleSize: 142,
    scriptSize: 150,
  },
  {
    html: "public/evangilism_eng.html",
    pdf: "public/evangilism_eng.pdf",
    titleSize: 142,
    scriptSize: 100,
  },
];

const root = process.cwd();
const browser = await chromium.launch();

for (const { html, pdf, titleSize, scriptSize } of posters) {
  const page = await browser.newPage({
    viewport: { width: 820, height: 1061 },
  });

  await page.goto(pathToFileURL(path.resolve(root, html)).href, {
    waitUntil: "networkidle",
  });

  // Capture the on-screen poster layout, not Chromium's print stylesheet.
  await page.emulateMedia({ media: "screen" });
  await page.addStyleTag({
    content: `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 820px !important;
        height: 1061px !important;
        overflow: hidden !important;
        background: #fff !important;
      }
      body {
        display: block !important;
      }
      .poster {
        width: 820px !important;
        height: 1061px !important;
        max-width: none !important;
        box-shadow: none !important;
      }
      h1 { font-size: ${titleSize}px !important; }
      .script { font-size: ${scriptSize}px !important; }
    `,
  });

  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }),
      ),
    );
  });
  await new Promise((resolve) => setTimeout(resolve, 400));

  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const script = document.querySelector(".script");
    const eyebrow = document.querySelector(".eyebrow");
    return {
      h1: getComputedStyle(h1).fontSize,
      script: getComputedStyle(script).fontSize,
      eyebrowTop: Math.round(eyebrow.getBoundingClientRect().top),
    };
  });
  console.log(html, metrics);

  const out = path.resolve(root, pdf);
  await page.pdf({
    path: out,
    width: "8.5in",
    height: "11in",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  console.log(`Wrote ${out}`);
  await page.close();
}

await browser.close();
