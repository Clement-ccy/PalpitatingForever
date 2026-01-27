import fs from 'fs';
import path from 'path';

/**
 * FETCH NOTION DATA SCRIPT
 * 
 * Fetches pages and their blocks recursively from the Notion API.
 * Uses NOTION_TOKEN from environment variables.
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATA_SOURCE_ID = '2e7ec12a-acd9-803c-b7f7-cdfacbfba6e0'; // Example ID from CATEGORY_MAP

async function fetchNotion(endpoint: string, options: any = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2025-09-03',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function fetchBlockChildren(blockId: string): Promise<any[]> {
  console.log(`  - Fetching children for block: ${blockId}`);
  let blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const data: any = await fetchNotion(`/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`);
    const results = data.results;
    
    // For each block, if it has children, fetch them recursively
    for (const block of results) {
      if (block.has_children) {
        block.children = await fetchBlockChildren(block.id);
      }
    }
    
    blocks = blocks.concat(results);
    cursor = data.next_cursor;
  } while (cursor);

  return blocks;
}

async function main() {
  if (!NOTION_TOKEN) {
    console.error('❌ Error: NOTION_TOKEN is not set in environment variables.');
    process.exit(1);
  }

  console.log('🚀 Starting Recursive Notion Data Fetch...');

  try {
    // 1. Query Data Source (Pages)
    console.log(`1. Querying data source: ${DATA_SOURCE_ID}`);
    const pagesData = await fetchNotion(`/data_sources/${DATA_SOURCE_ID}/query`, {
      method: 'POST',
    });
    
    const outputPath = path.join(process.cwd(), 'src/data/refs');
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

    fs.writeFileSync(
      path.join(outputPath, 'notion-pages.json'),
      JSON.stringify(pagesData, null, 2)
    );
    console.log(`✅ Saved ${pagesData.results.length} pages to notion-pages.json`);

    // 2. Fetch Blocks for each page recursively
    console.log('2. Fetching blocks for each page...');
    const allPageBlocks: Record<string, any[]> = {};

    for (const page of pagesData.results) {
      console.log(`📄 Page: ${page.id}`);
      const blocks = await fetchBlockChildren(page.id);
      allPageBlocks[page.id] = blocks;
      
      // Save individual page blocks
      fs.writeFileSync(
        path.join(outputPath, `blocks-${page.id}.json`),
        JSON.stringify({ results: blocks }, null, 2)
      );
    }

    console.log('✅ All data fetched and saved successfully.');
  } catch (err: any) {
    console.error('❌ Fetch failed:', err.message);
  }
}

main();
