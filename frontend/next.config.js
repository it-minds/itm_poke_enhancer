/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");
const { join } = require("path");
const { readdirSync } = require("fs");

const pattern = /^([a-z]{2}-[A-Z]{2})\.ts$/;
const startPath = join(process.cwd(), "src", "i18n");
const locales = readdirSync(startPath)
  .filter(x => pattern.test(x))
  .map(x => pattern.exec(x)[1]);

const defaultLocale = process.env.DEFAULT_LOCALE ?? locales[0];

if (!locales.includes(defaultLocale)) {
  throw Error("Default Locale not part of other locales: " + locales.join(","));
}

console.log("Building locales:", locales, "default locale:", defaultLocale);

module.exports = withPWA({
  swcMinify: true,
  pwa: {
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: false,
    dest: "public"
  },
  i18n: {
    locales,
    defaultLocale
  }
});
