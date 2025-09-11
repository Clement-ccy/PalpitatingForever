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
      return [];
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
    return [];
  }
}

/**
 * Safely gets a property value from a Notion page properties object.
 */
function getPropertyValue(properties, propName, type) {
    const prop = properties?.[propName];
    if (!prop) {
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
                return prop.rich_text || [];
            case 'select':
                return prop.select?.name || null;
            case 'multi_select':
                return prop.multi_select?.map(item => item.name) || [];
            case 'date':
                return prop.date ? { start: prop.date.start, end: prop.date.end, time_zone: prop.date.time_zone } : null;
            case 'files':
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
                return prop.number;
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

/**
 * Generates a URL-friendly slug from a string.
 * @param {string} text - The text to slugify.
 * @returns {string} - The slugified string.
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars but hyphens
    .replace(/--+/g, '-') // Replace multiple - with single -
    .substring(0, 75); // Truncate to a reasonable length
}


// --- Main Data Fetching Logic ---

async function fetchData() {
  console.log('🚀 Starting data fetch from Notion...');

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // --- 1. Fetch Blogs ---
    console.log('📚 Fetching Blogs...');
    const blogFilter = {
       or: [
        { property: 'Status', status: { equals: '构思 (Idea)' } },
        { property: 'Status', status: { equals: '草稿 (Draft)' } },
        { property: 'Status', status: { equals: '待发布 (Scheduled)' } },
        { property: 'Status', status: { equals: '需更新 (Needs Update)' } },
        { property: 'Status', status: { equals: '发布 (Published)' } },
      ]
    };
    const blogSorts = [{ property: 'Publish Date', direction: 'descending' }];
    const blogPages = await getAllPagesFromDatabase(BLOGS_DATABASE_ID, blogFilter, blogSorts);
    const processedBlogs = await Promise.all(blogPages.map(async (page) => {
      const props = page.properties;
      const title = getPropertyValue(props, 'Name', 'title');
      const mainCategory = getPropertyValue(props, 'Main Category', 'select');
      const categorySlug = slugify(mainCategory || 'uncategorized');
      const titleSlug = slugify(title || page.id);
      const slug = `${categorySlug}/${titleSlug}`;
      console.log(`  -> Fetching blocks for blog: ${title}`);
      const blocks = await fetchBlocksRecursive(page.id);
      return {
        id: page.id,
        object: 'page',
        title: title,
        slug: slug,
        status: getPropertyValue(props, 'Status', 'status'),
        mainCategory: mainCategory,
        subCategory: getPropertyValue(props, 'Subcategory', 'select'),
        tags: getPropertyValue(props, 'Tags', 'multi_select'),
        coverImage: getPropertyValue(props, 'Cover Image', 'files')?.[0] || null,
        excerpt: getPropertyValue(props, 'Excerpt', 'rich_text'),
        publishDate: getPropertyValue(props, 'Publish Date', 'date'),
        lastEditedTime: page.last_edited_time,
        createdTime: page.created_time,
        blocks: blocks,
      };
    }));
    await fs.writeFile(path.join(OUTPUT_DIR, 'blogs.json'), JSON.stringify(processedBlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedBlogs.length} blog posts.`);

    // --- 2. Fetch Works ---
    console.log('🎨 Fetching Works...');
     const worksFilter = {
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
            title: getPropertyValue(props, 'Name', 'title'),
            status: getPropertyValue(props, 'Project Status', 'status'),
            mainVisual: getPropertyValue(props, 'Main Visual', 'files')?.[0] || null,
            category: getPropertyValue(props, 'Project Category', 'select'),
            tags: getPropertyValue(props, 'Tags', 'multi_select'),
            skillsUsed: getPropertyValue(props, 'Skills Used', 'multi_select'),
            completionDate: getPropertyValue(props, 'Finish Date', 'date'),
            description: getPropertyValue(props, 'Project Description', 'rich_text'),
            context: getPropertyValue(props, 'Context', 'rich_text'),
            featured: getPropertyValue(props, 'Featured', 'checkbox'),
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    });
    await fs.writeFile(path.join(OUTPUT_DIR, 'works.json'), JSON.stringify(processedWorks, null, 2));
    console.log(`✅ Successfully fetched ${processedWorks.length} works.`);

    // --- 3. Fetch Plogs ---
    console.log('📸 Fetching Plogs...');
    const plogSorts = [ { property: 'Date', direction: 'descending' } ];
    const plogPages = await getAllPagesFromDatabase(PLOGS_DATABASE_ID, undefined, plogSorts);
    const processedPlogs = await Promise.all(plogPages.map(async (page) => {
        const props = page.properties;
        const title = getPropertyValue(props, 'Name', 'title');
        const dateObj = getPropertyValue(props, 'Date', 'date');
        const dateString = dateObj?.start?.replace(/-/g, '') || 'nodate'; // YYYYMMDD or 'nodate'
        const titleSlug = slugify(title || page.id);
        const plogSlug = `${dateString}-${titleSlug}`;

        console.log(`  -> Fetching blocks for plog: ${title || page.id}`);
        const blocks = await fetchBlocksRecursive(page.id);

        return {
            id: page.id,
            object: 'page',
            title: title,
            slug: plogSlug, // Add the generated slug
            imageFile: getPropertyValue(props, 'Main Visual', 'files')?.[0] || null,
            category: getPropertyValue(props, 'Category', 'multi_select'),
            location: getPropertyValue(props, 'Location', 'rich_text'),
            date: dateObj,
            tags: getPropertyValue(props, 'Tags', 'multi_select'),
            featured: getPropertyValue(props, 'Featured', 'checkbox'),
            notes: getPropertyValue(props, 'Notes', 'rich_text'),
            blocks: blocks,
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    }));
    await fs.writeFile(path.join(OUTPUT_DIR, 'plogs.json'), JSON.stringify(processedPlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedPlogs.length} plogs.`);

    // --- 4. Fetch Mlogs ---
    console.log('🎵 Fetching Mlogs...');
    const mlogSorts = [ { property: 'Completion Date', direction: 'descending' } ];
    const mlogPages = await getAllPagesFromDatabase(MLOGS_DATABASE_ID, undefined, mlogSorts);
    const processedMlogs = mlogPages.map((page) => {
        const props = page.properties;
        return {
            id: page.id,
            object: 'page',
            title: getPropertyValue(props, 'Name', 'title'),
            audioFile: getPropertyValue(props, 'Audio File', 'files')?.[0] || null,
            roles: getPropertyValue(props, 'My Role', 'multi_select'),
            genre: getPropertyValue(props, 'Genre', 'multi_select'),
            artwork: getPropertyValue(props, 'Track Artwork', 'files')?.[0] || null,
            vibe: getPropertyValue(props, 'Vibe', 'multi_select'),
            key: getPropertyValue(props, 'Key', 'select'),
            mode: getPropertyValue(props, 'Mode', 'select'),
            bpm: getPropertyValue(props, 'BPM', 'number'),
            timeSignature: getPropertyValue(props, 'Time Signature', 'rich_text'),
            instrumentation: getPropertyValue(props, 'Instrumentation', 'multi_select'),
            completionDate: getPropertyValue(props, 'Completion Date', 'date'),
            album: getPropertyValue(props, 'Album', 'rich_text'),
            collaborators: getPropertyValue(props, 'Collaborators', 'rich_text'),
            lyricsFile: getPropertyValue(props, 'Lyrics File', 'files')?.[0] || null,
            lastEditedTime: page.last_edited_time,
            createdTime: page.created_time,
        };
    });
    await fs.writeFile(path.join(OUTPUT_DIR, 'mlogs.json'), JSON.stringify(processedMlogs, null, 2));
    console.log(`✅ Successfully fetched ${processedMlogs.length} mlogs.`);

    console.log('🎉 Notion data fetch complete!');

  } catch (error) {
    console.error('❌ Fatal error during Notion data fetch:', error);
    process.exit(1);
  }
}

// --- Execute Fetch ---
fetchData();