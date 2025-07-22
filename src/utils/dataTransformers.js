// src/utils/dataTransformers.js
/**
 * 数据转换工具 - 将 Notion 数据转换为应用所需格式
 */

/**
 * 提取 Notion 富文本的纯文本内容
 * @param {Array} richText - Notion 富文本数组
 * @returns {string} 纯文本内容
 */
export function extractPlainText(richText) {
  if (!Array.isArray(richText)) return '';
  return richText.map(item => item.plain_text || '').join('');
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {string|object} date - 日期字符串或 Notion 日期对象
 * @returns {string} 格式化后的日期
 */
export function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  if (typeof date === 'object' && date.start) return date.start;
  return '';
}

/**
 * 生成文章 URL
 * @param {string} slug - 文章 slug
 * @returns {string} 完整的文章 URL
 */
export function generatePostUrl(slug) {
  if (!slug) return '/blog';
  // 移除开头的斜杠，确保路径格式正确
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  return `/blog/post/${cleanSlug}`;
}

/**
 * 转换单个博客文章数据
 * @param {object} notionPost - Notion 博客文章数据
 * @returns {object} 转换后的文章数据
 */
export function transformBlogPost(notionPost) {
  if (!notionPost) return null;

  const title = notionPost.title || '';
  const excerpt = extractPlainText(notionPost.excerpt);
  const publishDate = formatDate(notionPost.publishDate);
  const coverImage = notionPost.coverImage?.url || null;
  const category = notionPost.mainCategory || '未分类';
  const subCategory = notionPost.subCategory || null;
  const tags = Array.isArray(notionPost.tags) ? notionPost.tags : [];
  const status = notionPost.status || '';

  // 判断文章状态
  const isPublished = status === '发布 (Published)';
  const needsUpdate = status === '需更新 (Needs Update)';
  const isNew = new Date(notionPost.createdTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7天内创建
  const isUnread = true; // 可以根据用户阅读记录来设置

  return {
    id: notionPost.id,
    title,
    excerpt,
    cover: coverImage,
    category,
    subCategory,
    tags,
    date: publishDate,
    status,
    slug: notionPost.slug,
    url: generatePostUrl(notionPost.slug),
    publishDate: notionPost.publishDate,
    lastEditedTime: notionPost.lastEditedTime,
    createdTime: notionPost.createdTime,
    blocks: notionPost.blocks || [],
    
    // 状态标识
    isPublished,
    needsUpdate,
    isNew,
    isUnread,
    recommended: false, // 可以根据特定条件设置
  };
}

/**
 * 转换博客文章列表
 * @param {Array} notionPosts - Notion 博客文章数组
 * @returns {Array} 转换后的文章数组
 */
export function transformBlogPosts(notionPosts) {
  if (!Array.isArray(notionPosts)) return [];
  
  return notionPosts
    .map(transformBlogPost)
    .filter(post => post !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 按发布日期降序排列
}

/**
 * 获取已发布的文章
 * @param {Array} posts - 文章数组
 * @returns {Array} 已发布的文章
 */
export function getPublishedPosts(posts) {
  return posts.filter(post => post.isPublished);
}

/**
 * 获取推荐文章
 * @param {Array} posts - 文章数组
 * @param {number} limit - 限制数量
 * @returns {Array} 推荐文章
 */
export function getFeaturedPosts(posts, limit = 5) {
  // 优先选择已发布的文章，然后按日期排序
  return getPublishedPosts(posts)
    .slice(0, limit)
    .map(post => ({ ...post, recommended: true }));
}

/**
 * 按分类分组文章
 * @param {Array} posts - 文章数组
 * @returns {object} 按分类分组的文章对象
 */
export function groupPostsByCategory(posts) {
  return posts.reduce((groups, post) => {
    const category = post.category || '未分类';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(post);
    return groups;
  }, {});
}

/**
 * 获取所有分类
 * @param {Array} posts - 文章数组
 * @returns {Array} 分类数组
 */
export function getCategories(posts) {
  const categories = new Set();
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  const categoryList = Array.from(categories).map(name => ({
    name,
    path: `/blog/category/${encodeURIComponent(name)}`,
    active: false
  }));

  // 添加特殊分类
  return [
    { name: '精选', path: '/blog', active: true },
    { name: '全部文章', path: '/blog/all', active: false },
    ...categoryList
  ];
}

/**
 * 获取所有标签及其使用次数
 * @param {Array} posts - 文章数组
 * @returns {Array} 标签数组，包含使用次数
 */
export function getTags(posts) {
  const tagCounts = {};
  
  posts.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // 按使用次数降序排列
}

/**
 * 获取统计信息
 * @param {Array} posts - 文章数组
 * @returns {object} 统计信息
 */
export function getBlogStats(posts) {
  const publishedPosts = getPublishedPosts(posts);
  const totalWords = publishedPosts.reduce((total, post) => {
    // 简单估算：每个 block 约 50 个字
    return total + (post.blocks?.length || 0) * 50;
  }, 0);

  // 计算写作天数（从第一篇文章到现在）
  const firstPostDate = publishedPosts.length > 0 
    ? new Date(publishedPosts[publishedPosts.length - 1].date)
    : new Date();
  const daysSinceFirst = Math.floor((new Date() - firstPostDate) / (1000 * 60 * 60 * 24));

  return {
    posts: publishedPosts.length,
    days: Math.max(daysSinceFirst, 1),
    words: formatWordCount(totalWords),
    comments: 0 // 如果有评论系统，可以在这里计算
  };
}

/**
 * 格式化字数显示
 * @param {number} count - 字数
 * @returns {string} 格式化后的字数
 */
function formatWordCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}