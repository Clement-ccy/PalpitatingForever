// src/utils/notion.js

/**
 * @typedef {Object} BlogPost
 * @property {string} id - Notion 页面 ID
 * @property {string} title - 博客文章的标题 (Notion 属性: Title)
 * @property {string | null} status - 文章状态 (Notion 属性: Status - Select)
 * @property {string | null} mainCategory - 主分类 (Notion 属性: Main Category - Select)
 * @property {string | null} subcategory - 子分类 (Notion 属性: Subcategory - Select)
 * @property {string[]} tags - 标签 (Notion 属性: Tags - Multi-select)
 * @property {string | null} coverImage - 封面图 URL (Notion 属性: Cover Image - Files &amp; Media)
 * @property {string} excerpt - 简介 (Notion 属性: Excerpt - Text/Rich Text)
 * @property {string | null} publishDate - 发布日期 (Notion 属性: Publish Date - Date)
 * @property {string} lastEditedTime - 最后编辑时间 (Notion 自动属性)
 * @property {string} createdTime - 创建时间 (Notion 自动属性)
 * @property {string} url - Notion 页面 URL
 */

/**
 * @typedef {Object} WorkPost
 * @property {string} id - Notion 页面 ID
 * @property {string} title - 项目标题 (Notion 属性: Name/Title)
 * @property {string | null} mainVisual - 主视觉图 URL (Notion 属性: Main Visual - Files &amp; Media)
 * @property {string | null} projectType - 项目类型 (Notion 属性: Project Type - Select)
 * @property {string[]} tags - 标签 (Notion 属性: Tags - Multi-select)
 * @property {string | null} projectStatus - 项目状态 (Notion 属性: Project Status - Select/Status)
 * @property {string[]} skillsUsed - 使用技能 (Notion 属性: Skill Used - Multi-select)
 * @property {string | null} finishedDate - 完成日期 (Notion 属性: Finished Date - Date)
 * @property {string} projectDescription - 项目描述 (Notion 属性: Project Description - Rich Text)
 * @property {string} context - 项目背景/内容 (Notion 属性: Context - Rich Text)
 * @property {boolean} featuredProject - 是否为精选项目 (Notion 属性: Featured Project - Checkbox)
 * @property {string} lastEditedTime - 最后编辑时间 (Notion 自动属性)
 * @property {string} createdTime - 创建时间 (Notion 自动属性)
 * @property {string} url - Notion 页面 URL
 */

/**
 * 用于存储所有处理后的博客文章
 * @type {BlogPost[]}
 */
const allBlogPosts = [];

/**
 * 用于存储所有处理后的作品项目
 * @type {WorkPost[]}
 */
const allWorkPosts = [];


/**
 * 处理从 Notion API 获取的单个页面结果，并将其转换为 BlogPost 对象。
 * @param {Object} page - Notion API 返回的页面对象
 * @returns {BlogPost} - 处理后的博客文章对象
 */
function processPageProperties(page) {
    const properties = page.properties;

    // --- 提取核心属性 ---
    const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'; // 使用 'Name' 作为博客标题属性名? 确认一下
    const status = properties['Status']?.status?.name || properties['Status']?.select?.name || null;
    const mainCategory = properties['Main Category']?.select?.name || null;
    const subcategory = properties['Subcategory']?.select?.name || null;
    const tags = properties['Tags']?.multi_select?.map(tag => tag.name) || [];

    // --- 提取辅助属性 ---
    const coverImage = properties['Cover Image']?.files?.[0]?.file?.url
        || properties['Cover Image']?.files?.[0]?.external?.url
        || null;
    const excerpt = properties['Excerpt']?.rich_text?.map(rt => rt.plain_text).join('') || '';
    const publishDate = properties['Publish Date']?.date?.start || null;

    // --- 提取自动属性 ---
    const lastEditedTime = page.last_edited_time;
    const createdTime = page.created_time;

    // --- 构建 BlogPost 对象 ---
    const blogPost = {
        id: page.id,
        title: title,
        status: status,
        mainCategory: mainCategory,
        subcategory: subcategory,
        tags: tags,
        coverImage: coverImage,
        excerpt: excerpt,
        publishDate: publishDate,
        lastEditedTime: lastEditedTime,
        createdTime: createdTime,
        url: page.url // Notion 页面 URL
    };

    return blogPost;
}

/**
* 处理从 Notion API 获取的单个页面结果，并将其转换为 WorkPost 对象。
* 注意：请根据你的 Notion Works Database 实际属性名称调整 properties['...'] 中的键名。
* @param {Object} page - Notion API 返回的页面对象
* @returns {WorkPost} - 处理后的作品项目对象
*/
function processWorkProperties(page) {
    const properties = page.properties;

    // --- 提取核心属性 ---
    const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled Project'; // 假设属性名为 'Name'
    const projectType = properties['Project Type']?.select?.name || null;
    const projectStatus = properties['Project Status']?.status?.name || properties['Project Status']?.select?.name || null;
    const tags = properties['Tags']?.multi_select?.map(tag => tag.name) || [];
    const skillsUsed = properties['Skill Used']?.multi_select?.map(skill => skill.name) || [];

    // --- 提取辅助属性 ---
    const mainVisual = properties['Main Visual']?.files?.[0]?.file?.url
        || properties['Main Visual']?.files?.[0]?.external?.url
        || null;
    const projectDescription = properties['Project Description']?.rich_text?.map(rt => rt.plain_text).join('') || '';
    const context = properties['Context']?.rich_text?.map(rt => rt.plain_text).join('') || '';
    const finishedDate = properties['Finished Date']?.date?.start || null;
    const featuredProject = properties['Featured Project']?.checkbox || false;

    // --- 提取自动属性 ---
    const lastEditedTime = page.last_edited_time;
    const createdTime = page.created_time;

    // --- 构建 WorkPost 对象 ---
    const workPost = { // Corrected variable name
        id: page.id,
        title: title,
        mainVisual: mainVisual,
        projectType: projectType,
        tags: tags,
        projectStatus: projectStatus,
        skillsUsed: skillsUsed,
        finishedDate: finishedDate,
        projectDescription: projectDescription,
        context: context,
        featuredProject: featuredProject,
        lastEditedTime: lastEditedTime,
        createdTime: createdTime,
        url: page.url // Notion 页面 URL
    };

    return workPost; // Corrected return variable name
}


/**
 * 处理 Notion API 返回的一批博客结果。
 * @param {Array<Object>} results - Notion API 返回的页面对象数组
 */
function processBlogResults(results) { // Renamed for clarity
    results.forEach(page => {
        const blogPost = processPageProperties(page);
        allBlogPosts.push(blogPost);
    });
}

/**
 * 处理 Notion API 返回的一批作品结果。
 * @param {Array<Object>} results - Notion API 返回的页面对象数组
 */
function processWorkResults(results) { // Renamed for clarity
    results.forEach(page => {
        const workPost = processWorkProperties(page); // Corrected variable name
        allWorkPosts.push(workPost); // Corrected variable name
    });
}

/**
 * 查询 Notion 数据库并获取所有博客文章。
 * 使用分页处理，直到获取所有数据。
 * @returns {BlogPost[]} - 返回包含所有博客文章对象的 Promise 数组
 */
async function queryBlogsDatabase() {
    allBlogPosts.length = 0; // Clear previous results
    try {
        let hasMore = true;
        let nextCursor = null;
        const databaseId = import.meta.env.VITE_NOTION_BLOGS_DATABASE_ID; // Use correct variable name
        if (!databaseId) {
            console.error('Error: VITE_NOTION_BLOGS_DATABASE_ID environment variable is not set.');
            return [];
        }

        while (hasMore) {
            console.log("Notion API is called to query BLOGS database...");
            const response = await fetch(`/notion-api/v1/databases/${databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: nextCursor ? JSON.stringify({ start_cursor: nextCursor }) : JSON.stringify({})
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching Notion Blogs data:', response.status, errorData);
                throw new Error(`Notion API Error (Blogs): ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            processBlogResults(data.results); // Use specific processor

            hasMore = data.has_more;
            nextCursor = data.next_cursor;
        }
    } catch (error) {
        console.error('Error in queryBlogsDatabase:', error);
    }
    console.log(`Fetched ${allBlogPosts.length} blog posts.`);
    return allBlogPosts;
}


/**
* 查询 Notion Works 数据库并获取所有项目。
* 使用分页处理，直到获取所有数据。
* @returns {WorkPost[]} - 返回包含所有作品项目对象的 Promise 数组
*/
async function queryWorksDatabase() {
    allWorkPosts.length = 0; // Clear previous results
    try {
        let hasMore = true;
        let nextCursor = null;
        const databaseId = import.meta.env.VITE_NOTION_WORKS_DATABASE_ID;
        if (!databaseId) {
            console.error('Error: VITE_NOTION_WORKS_DATABASE_ID environment variable is not set.');
            return [];
        }

        while (hasMore) {
            console.log("Notion API is called to query WORKS database...");
            const response = await fetch(`/notion-api/v1/databases/${databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: nextCursor ? JSON.stringify({ start_cursor: nextCursor }) : JSON.stringify({})
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching Notion Works data:', response.status, errorData);
                throw new Error(`Notion API Error (Works): ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            processWorkResults(data.results); // Use specific processor

            hasMore = data.has_more;
            nextCursor = data.next_cursor;
        }
    } catch (error) {
        console.error('Error in queryWorksDatabase:', error);
    }
    console.log(`Fetched ${allWorkPosts.length} work projects.`);
    return allWorkPosts;
}

/**
 * 查询指定 Notion 块（或页面）的所有子块。
 * 使用分页处理，直到获取所有子块。
 * @param {string} blockId - 要查询其子块的 Notion 块或页面的 ID。
 * @returns {Promise<Array<Object>>} - 返回包含所有子块对象的 Promise 数组。原始块对象将直接从 API 返回。
 */
async function queryPageBlocks(blockId) {
    const allBlocks = [];
    if (!blockId) {
        console.error('Error: blockId is required for queryPageBlocks.');
        return [];
    }

    try {
        let hasMore = true;
        let nextCursor = null;

        while (hasMore) {
            console.log(`Notion API is called to query blocks for block ID: ${blockId}...`);
            let apiUrl = `/notion-api/v1/blocks/${blockId}/children`;
            if (nextCursor) {
                apiUrl += `?start_cursor=${nextCursor}`;
            }

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Error fetching Notion blocks for ${blockId}:`, response.status, errorData);
                throw new Error(`Notion API Error (Blocks): ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            allBlocks.push(...data.results);

            hasMore = data.has_more;
            nextCursor = data.next_cursor;
        }
    } catch (error) {
        console.error(`Error in queryPageBlocks for block ID ${blockId}:`, error);
    }
    console.log(`Fetched ${allBlocks.length} blocks for block ID ${blockId}.`);
    return allBlocks;
}



/**
* 检索指定 Notion 页面的详细数据（主要是属性）。
* @param {string} pageId - 要检索的 Notion 页面的 ID。
* @returns {BlogPost} - 返回包含页面数据的 Promise 对象，如果出错则返回 null。原始页面对象将直接从 API 返回。
*/
async function retrieveBlogPage(pageId) {
   if (!pageId) {
       console.error('Error: pageId is required for retrievePage.');
       return null;
   }

   try {
       console.log(`Notion API is called to retrieve page data for page ID: ${pageId}...`);
       const apiUrl = `/notion-api/v1/pages/${pageId}`;

       const response = await fetch(apiUrl, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
               'Notion-Version': '2022-06-28'
               // 通常获取页面不需要 Authorization，除非你的代理需要
           }
       });

       if (!response.ok) {
           const errorData = await response.json();
           console.error(`Error fetching Notion page data for ${pageId}:`, response.status, errorData);
           // 对于 404 Not Found，可能需要特殊处理或仅记录日志而不是抛出错误
           if (response.status === 404) {
               console.warn(`Page with ID ${pageId} not found.`);
               return null;
           }
           throw new Error(`Notion API Error (Page Retrieve): ${response.status} - ${errorData.message || 'Unknown error'}`);
       }

       const pageData = await response.json();
       const processedBlogPage = processPageProperties(pageData); // 处理页面属性
       console.log(`Successfully retrieved data for page ID ${pageId}.`);
       return processedBlogPage; // 返回完整的页面对象

   } catch (error) {
       console.error(`Error in retrievePage for page ID ${pageId}:`, error);
       return null; // 返回 null 表示失败
   }
}

// Export all functions at the end
export { queryBlogsDatabase, queryWorksDatabase, queryPageBlocks, retrieveBlogPage };
