/**
 * takeKONTROL — server entry point
 * Boots the app, prints where it is listening, and shuts down cleanly
 * so the order log is closed rather than truncated.
 */
import 'dotenv/config';
import { createApp } from './app.js';
import { PORT, STATIC_DIR } from './config.js';
import { assertConfigured, paypalEnvironment } from './paypal.js';
import { closeStore } from './store.js';


const app = createApp();

try {
  assertConfigured();
} catch (err) {
  console.warn(`\n⚠️  ${err.message}\n`);
}

const server = app.listen(PORT, () => {
  console.log(`takeKONTROL checkout API → http://localhost:${PORT} (${paypalEnvironment})`);
  console.log(`serving static files from ${STATIC_DIR}`);
});

let shuttingDown = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(() => {
      closeStore();
      process.exit(0);
    });
    // Do not wait forever for a stuck keep-alive connection.
    setTimeout(() => { closeStore(); process.exit(0); }, 5000).unref();
  });
}

export default app;
