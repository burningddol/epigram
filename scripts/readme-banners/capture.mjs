import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "_tmp");
const BASE = "https://epigram-flax.vercel.app";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 };

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: VIEWPORT,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--lang=ko-KR"],
  });

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": "ko-KR,ko;q=0.9" });

  // 1) login as guest
  console.log("Logging in as guest...");
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  await page.type('input[type="email"]', "guest13325@naver.com");
  await page.type('input[type="password"]', "@qwer1234");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
    page.evaluate(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }),
  ]);

  console.log("After login URL:", page.url());

  const targets = [
    { name: "feeds", path: "/feeds" },
    { name: "addepigram", path: "/addepigram" },
    { name: "mypage", path: "/mypage" },
    { name: "landing", path: "/" },
  ];

  for (const t of targets) {
    console.log(`Capturing ${t.name}...`);
    await page.goto(`${BASE}${t.path}`, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000)); // settle animations
    await page.screenshot({
      path: path.join(OUT, `live-${t.name}.png`),
      fullPage: false,
    });
  }

  await browser.close();
  console.log("Done.");
}

captureAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
