/**
 * DEPRECATED — do not run.
 *
 * This script used to rotate logo files when they were one step out of sync.
 * Running it on correctly aligned files scrambles logos (D4/Slormancer/NRFTW/PoE2).
 *
 * To fix wrong logos, re-fetch from source URLs:
 *   npm run logos:fetch
 *   (or: node scripts/download-logos.mjs)
 */
console.error(
  "fix-countdown-logos.mjs is deprecated and does nothing.\n" +
    "Run: npm run logos:fetch\n"
);
process.exit(1);
