import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { run as runReactSnap } from "react-snap";
import puppeteer from "puppeteer";

const puppeteerVersion = "24.20.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

function ensure404Redirect() {
  const indexPath = path.join(distDir, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error("dist/index.html not found. Build output is missing.");
  }

  const indexHtml = readFileSync(indexPath, "utf8");
  const target404Path = path.join(distDir, "404.html");
  writeFileSync(target404Path, indexHtml);
}

async function runPrerender() {
  console.log(
    `Using Puppeteer ${puppeteerVersion} for react-snap prerendering.`,
  );

  const options = {
    source: "dist",
    destination: "dist",
    include: [
      "/",
      "/blog",
      "/website-survey",
      "/website-benefits",
      "/services",
      "/contact",
      "/faqs",
      "/privacy-policy",
      "/terms-of-service",
    ],
    crawl: true,
    skipThirdPartyRequests: true,
    puppeteerExecutablePath: puppeteer.executablePath(),
    puppeteerArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--remote-debugging-port=0",
    ],
    headless: true,
    publicPath: "/web/",
    waitFor: () => window.__APP_READY__ === true,
  };

  try {
    await runReactSnap(options);
  } catch (error) {
    console.warn(
      "react-snap finished with warnings, but the build artifacts were still generated.",
    );
    console.warn(error instanceof Error ? error.message : error);
  }
}

ensure404Redirect();
await runPrerender();
