// scripts/fetch-notion-data.js
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
dotenv.config(); // Load environment variables from .env

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const BLOGS_DATABASE_ID = process.env.NOTION_BLOGS_DATABASE_ID;
const WORKS_DATABASE_ID = process.env.NOTION_WORKS_DATABASE_ID;
const PLOGS_DATABASE_ID = process.env.NOTION_PLOGS_DATABASE_ID;
const MLOGS_DATABASE_ID = process.env.NOTION_MLOGS_DATABASE_ID;
// Add Page IDs if needed for static pages like About, Links, Gear
// const BLOG_ABOUT_PAGE_ID = process.env.NOTION_BLOG_ABOUT_PAGE_ID;

const OUTPUT_DIR = path.resolve('src/data'); // Data output directory

// --- Validate Configuration ---
if (!NOTION_API_KEY || !BLOGS_DATABASE_ID || !WORKS_DATABASE_ID || !PLOGS_DATABASE_ID || !MLOGS_DATABASE_ID) {
  console.error('❌ Error: Please ensure NOTION_API_KEY and all DATABASE_IDs are set in your .env file.');
  process.exit(1);
}

// --- Notion Client Initialization ---
const notion = new Client({ auth: NOTION_API_KEY });

// --- Helper Functions ---

/**
 * Recursively fetches all blocks for a given block ID (page ID or block ID).
 * @param {string} blockId - The ID of the block (or page) to fetch children for.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of block objects with nested children.
 */
async function fetchBlocksRecursive(blockId) {
  const blocks = [];
  let cursor = undefined;
  try {
    do {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100, // Max page size
      });

      for (const block of results) {
        if (block.has_children) {
          // Recursively fetch children for blocks that have them
          console.log(`    -> Fetching children for block: ${block.id} (${block.type})`);
          const children = await fetchBlocksRecursive(block.id);
          block[block.type].children = children; // Attach children to the parent block object
        }
        blocks.push(block);
      }
      cursor = next_cursor;
    } while (cursor);
    return blocks;
  } catch (error) {
      console.error(`❌ Error fetching blocks for ID ${blockId}:`, error.message);
      // Depending on severity, you might want to return [] or re-throw
      return []; // Return empty array on error for this block level
  }
}

/**
 * Fetches all pages from a Notion database, handling pagination.
 * @param {string} databaseId - The ID of the database to query.
 * @param {object} [filter] - Optional filter object for the query.
 * @param {Array<object>} [sorts] - Optional sorts array for the query.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of page objects.
 */
async function getAllPagesFromDatabase(databaseId, filter, sorts) {
  const pages = [];
  let cursor = undefined;
  try {
    do {
      const { results, next_cursor } = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
        filter: filter,
        sorts: sorts,
      });
      pages.push(...results);
      cursor = next_cursor;
    } while (cursor);
    return pages;
  } catch (error) {
    console.error(`❌ Error querying database ${databaseId}:`, error.message);
    return []; // Return empty on error
  }
}

/**
 * Safely gets a property value from a Notion page properties object.
 * Handles different property types and potential null/undefined values.
 * @param {object} properties - The Notion page properties object.
 * @param {string} propName - The name of the property.
 * @param {'title'|'rich_text'|'select'|'multi_select'|'date'|'files'|'status'|'checkbox'|'number'|'url'|'email'|'phone_number'} type - The expected property type.
 * @returns {*} - The extracted property value or a default value (e.g., '', [], null).
 */
function getPropertyValue(properties, propName, type) {
    const prop = properties?.[propName];
    if (!prop) {
        // Return appropriate default based on type
        switch (type) {
            case 'title': return '';
            case 'rich_text': return [];
            case 'multi_select': return [];
            case 'files': return [];
            case 'checkbox': return false;
            default: return null;
        }
    }

    try {
        switch (type) {
            case 'title':
                return prop.title?.[0]?.plain_text || '';
            case 'rich_text':
                // Return the full rich_text array for frontend rendering flexibility
                return prop.rich_text || [];
            case 'select':
                return prop.select?.name || null;
            case 'multi_select':
                return prop.multi_select?.map(item => item.name) || [];
            case 'date':
                // Return object with start/end, might be useful
                return prop.date ? { start: prop.date.start, end: prop.date.end, time_zone: prop.date.time_zone } : null;
            case 'files':
                 // Return array of file objects (handle 'file' vs 'external')
                return prop.files?.map(file => ({
                    name: file.name,
                    url: file.type === 'file' ? file.file?.url : file.external?.url,
                    type: file.type
                })) || [];
            case 'status':
                return prop.status?.name || null;
            case 'checkbox':
                return prop.checkbox || false;
            case 'number':
                return prop.number; // Can be null
            case 'url':
                return prop.url || null;
            case 'email':
                return prop.email || null;
            case 'phone_number':
                return prop.phone_number || null;
            default:
                console.warn(`Unsupported property type "${type}" for property "${propName}"`);
                return null;
        }
    } catch (error) {
        console.error(`Error accessing property "${propName}" of type "${type}":`, error);
        // Return appropriate default on error
         switch (type) {
            case 'title': return '';
            case 'rich_text': return [];
            case 'multi_select': return [];
            case 'files': return [];
            case 'checkbox': return false;
            default: return null;
        }
    }
}


// --- Main Data Fetching Logic ---

async function fetchData() {
  console.log('🚀 Starting data fetch from Notion...');

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // --- 1. Fetch Blogs ---
    console.log('📚 Fetching Blogs...');
    const blogFilter = {
       or: [
        { property: 'Status', status: { equals: '需更新 (Needs Update)' } },
        { property: 'Status', status: { equals: '归档 (Archived)' } },
      ]
    };
    const blogSorts = [
      {
        property: 'Publish Date', // Use English property name
        direction: 'descending',
      },
    ];
    const blogPages = await getAllPagesFromDatabase(BLOGS_DATABASE_ID, blogFilter, blogSorts);
    const processedBlogs = await Promise.all(blogPages.map(async (page) => {
      const props = page.properties;
      const title = getPropertyValue(props, 'Name', 'title'); // Assuming 'Title' is correct
      const mainCategory = getPropertyValue(props, 'Main Category', 'select'); // Use English name
      // Generate slug: category/post-title
      const categorySlug = mainCategory || 'uncategorized';
      const titleSlug = title || page.id;
      const slug = `${categorySlug}/${titleSlug}`;

      console.log(`  -> Fetching blocks for blog: ${title}`);
      const blocks = await fetchBlocksRecursive(page.id); // Fetch blocks for each blog post

      return {
        id: page.id,
        object: 'page', // Add object type for clarity
        title: title,
        slug: slug, // Generated slug
        status: getPropertyValue(props, 'Status', 'status'), // English name
        mainCategory: mainCategory,
        subCategory: getPropertyValue(props, 'Subcategory', 'select'), // English name
        tags: getPropertyValue(props, 'Tags', 'multi_select'), // English name
        coverImage: getPropertyValue(props, 'Cover Image', 'files')?.[0] || null, // English name
        excerpt: getPropertyValue(props, 'Excerpt', 'rich_text'), // English name
        publishDate: getPropertyValue(props, 'Publish Date', 'date'), // English name
        lastEditedTime: page.last_edited_time,
        createdTime: page.created_time,
        blocks: blocks, // Store the fetched block structure
        // Store raw properties if needed for debugging or advanced use cases
        // rawProperties: props,
      };
    }));
    await fs.writeFile(path.join(OUTPUT_DIR, 'blogs.json'), JSON.stringify(processedBlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedBlogs.length} blog posts.`);

    // --- 2. Fetch Works ---
    console.log('🎨 Fetching Works...');
     const worksFilter = { // Example: Fetch only featured or completed works
       or: [
          { property: 'Featured', checkbox: { equals: true } },
          { property: 'Project Status', status: { equals: '发布 (Published)' } },
          { property: 'Project Status', status: { equals: '已归档 (Archived)' } },
        ]
      };
     const worksSorts = [ { property: 'Finish Date', direction: 'descending' } ];
     const worksPages = await getAllPagesFromDatabase(WORKS_DATABASE_ID, worksFilter, worksSorts);
     const processedWorks = worksPages.map((page) => {
        const props = page.properties;
        return {
            id: page.id,
            object: 'page',
            title: getPropertyValue(props, 'Name', 'title'), // English name
            status: getPropertyValue(props, 'Project Status', 'status'), // English name
            mainVisual: getPropertyValue(props, 'Main Visual', 'files')?.[0] || null, // English name
            category: getPropertyValue(props, 'Project Category', 'select'), // English name
            tags: getPropertyValue(props, 'Tags', 'multi_select'), // English name
            skillsUsed: getPropertyValue(props, 'Skills Used', 'multi_select'), // English name
            completionDate: getPropertyValue(props, 'Finish Date', 'date'), // English name
            description: getPropertyValue(props, 'Project Description', 'rich_text'), // English name
            context: getPropertyValue(props, 'Context', 'rich_text'), // English name
            featured: getPropertyValue(props, 'Featured', 'checkbox'), // English name
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    });
    await fs.writeFile(path.join(OUTPUT_DIR, 'works.json'), JSON.stringify(processedWorks, null, 2));
    console.log(`✅ Successfully fetched ${processedWorks.length} works.`);

    // --- 3. Fetch Plogs ---
    console.log('📸 Fetching Plogs...');
    const plogSorts = [ { property: 'Date', direction: 'descending' } ]; // Use English property name
    const plogPages = await getAllPagesFromDatabase(PLOGS_DATABASE_ID, undefined, plogSorts); // Use undefined for filter
    const processedPlogs = plogPages.map((page) => {
        const props = page.properties;
        return {
            id: page.id,
            object: 'page',
            title: getPropertyValue(props, 'Name', 'title'), // English name
            imageFile: getPropertyValue(props, 'Main Visual', 'files')?.[0] || null, // English name
            category: getPropertyValue(props, 'Category', 'multi_select'), // English name
            location: getPropertyValue(props, 'Location', 'rich_text'), // English name
            date: getPropertyValue(props, 'Date', 'date'), // English name
            tags: getPropertyValue(props, 'Tags', 'multi_select'), // English name
            featured: getPropertyValue(props, 'Featured', 'checkbox'), // English name
            notes: getPropertyValue(props, 'Notes', 'rich_text'), // English name
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    });
    await fs.writeFile(path.join(OUTPUT_DIR, 'plogs.json'), JSON.stringify(processedPlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedPlogs.length} plogs.`);

    // --- 4. Fetch Mlogs ---
    console.log('🎵 Fetching Mlogs...');
    const mlogSorts = [ { property: 'Completion Date', direction: 'descending' } ]; // Use English property name
    const mlogPages = await getAllPagesFromDatabase(MLOGS_DATABASE_ID, undefined, mlogSorts); // Use undefined for filter
    const processedMlogs = mlogPages.map((page) => {
        const props = page.properties;
        return {
            id: page.id,
            object: 'page',
            title: getPropertyValue(props, 'Name', 'title'), // English name
            audioFile: getPropertyValue(props, 'Audio File', 'files')?.[0] || null, // English name
            roles: getPropertyValue(props, 'My Role', 'multi_select'), // English name
            genre: getPropertyValue(props, 'Genre', 'multi_select'), // English name
            artwork: getPropertyValue(props, 'Track Artwork', 'files')?.[0] || null, // English name
            vibe: getPropertyValue(props, 'Vibe', 'multi_select'), // English name
            key: getPropertyValue(props, 'Key', 'select'), // English name
            mode: getPropertyValue(props, 'Mode', 'select'), // English name
            bpm: getPropertyValue(props, 'BPM', 'number'), // English name (assuming BPM)
            timeSignature: getPropertyValue(props, 'Time Signature', 'rich_text'), // English name
            instrumentation: getPropertyValue(props, 'Instrumentation', 'multi_select'), // English name
            completionDate: getPropertyValue(props, 'Completion Date', 'date'), // English name
            album: getPropertyValue(props, 'Album', 'rich_text'), // English name
            collaborators: getPropertyValue(props, 'Collaborators', 'rich_text'), // English name
            lyricsFile: getPropertyValue(props, 'Lyrics File', 'files')?.[0] || null, // English name
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    });
    await fs.writeFile(path.join(OUTPUT_DIR, 'mlogs.json'), JSON.stringify(processedMlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedMlogs.length} mlogs.`);

    console.log('🎉 Notion data fetch complete!');

  } catch (error) {
    console.error('❌ Fatal error during Notion data fetch:', error);
    process.exit(1); // Exit with error code
  }
}

// --- Execute Fetch ---
fetchData();