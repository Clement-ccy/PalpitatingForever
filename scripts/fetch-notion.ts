import { runNotionSync } from './notion-sync/orchestrator.js';

const main = async (): Promise<void> => {
  try {
    await runNotionSync();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Fetch failed:', message);
    process.exitCode = 1;
  }
};

main();
