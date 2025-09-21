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
  const isPublished = status === '发布 (Published)' || status === '需更新 (Needs Update)';
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
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)); // 按发布日期降序排列
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

/**
 * 提取富文本的纯文本内容（专用于 Gears 数据）
 * @param {Array} richText - Notion 富文本数组
 * @returns {string} 纯文本内容
 */
function extractGearsText(richText) {
  if (!Array.isArray(richText)) return '';
  return richText.map(item => item.plain_text || '').join('');
}

/**
 * 转换单个装备数据
 * @param {object} notionGears - Notion 装备数据
 * @returns {object} 转换后的装备数据
 */
export function transformGearsItem(notionGears) {
  if (!notionGears) return null;

  const title = notionGears.title || '';
  const specification = extractGearsText(notionGears.specification);
  const description = extractGearsText(notionGears.description);
  const category = notionGears.category || '其他';
  const status = notionGears.status || '';
  const coverImage = notionGears.coverImage?.url || null;
  const productLink = notionGears.productLink || null;
  const isExternalLink = notionGears.isExternalLink || false;
  const hasReviewArticle = notionGears.reviewArticle && notionGears.reviewArticle.length > 0;
  
  // 根据规则生成 linkText 和最终链接
  let linkText = '';
  let finalLink = '';
  let external = false;

  if (hasReviewArticle) {
    // 有测评文章，链接到内部文章
    linkText = '查看文章';
    // 这里需要根据实际的文章 ID 生成链接，暂时使用占位符
    finalLink = `/blog/post/${notionGears.reviewArticle[0]?.id}`;
    external = false;
  } else if (productLink) {
    // 有产品链接，根据 isExternalLink 决定文本
    linkText = isExternalLink ? '详情' : '查看文章';
    finalLink = productLink;
    external = isExternalLink;
  } else {
    // 没有任何链接
    linkText = '';
    finalLink = '';
    external = false;
  }

  return {
    id: notionGears.id,
    name: title,
    specification,
    description,
    category,
    status,
    image: coverImage,
    link: finalLink,
    linkText,
    external,
    rating: notionGears.rating,
    purchaseDate: notionGears.purchaseDate,
    price: notionGears.price,
    tags: notionGears.tags || [],
    pros: extractGearsText(notionGears.pros),
    cons: extractGearsText(notionGears.cons),
    notes: extractGearsText(notionGears.notes),
    lastEditedTime: notionGears.lastEditedTime,
    createdTime: notionGears.createdTime,
  };
}

/**
 * 转换装备数据列表并按分类分组
 * @param {Array} notionGearsData - Notion 装备数据数组
 * @returns {object} 按分类分组的装备数据
 */
export function transformGearsData(notionGearsData) {
  if (!Array.isArray(notionGearsData)) return {};
  
  const transformedItems = notionGearsData
    .map(transformGearsItem)
    .filter(item => item !== null);

  // 按分类分组
  const groupedData = transformedItems.reduce((categories, item) => {
    const category = item.category || '其他';
    if (!categories[category]) {
      categories[category] = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        title: category,
        description: getCategoryDescription(category),
        items: []
      };
    }
    categories[category].items.push(item);
    return categories;
  }, {});

  // 转换为数组格式，匹配现有的数据结构
  return Object.values(groupedData);
}

/**
 * 获取分类描述
 * @param {string} category - 分类名称
 * @returns {string} 分类描述
 */
function getCategoryDescription(category) {
  const descriptions = {
    '生产力': '提升自己生产效率的硬件设备',
    '出行': '用来出行的实物及设备',
    '家庭娱乐': '用来娱乐的硬件设备',
    '健康生活': '日常用的一些小的数码好物',
    '其他': '其他类型的装备'
  };
  return descriptions[category] || '其他类型的装备';
}

/**
 * 获取装备统计信息
 * @param {Array} gearsData - 装备数据数组
 * @returns {object} 统计信息
 */
export function getGearsStats(gearsData) {
  if (!Array.isArray(gearsData)) return { total: 0, categories: 0, inUse: 0 };
  
  const categories = new Set();
  let inUseCount = 0;
  
  gearsData.forEach(item => {
    categories.add(item.category);
    if (item.status === '使用中') {
      inUseCount++;
    }
  });

  return {
    total: gearsData.length,
    categories: categories.size,
    inUse: inUseCount
  };
}

/**
 * 转换单个友链数据
 * @param {object} notionLinks - Notion 友链数据
 * @returns {object} 转换后的友链数据
 */
export function transformLinksItem(notionLinks) {
  if (!notionLinks) return null;

  const name = notionLinks.name || '';
  const url = notionLinks.url || '';
  const description = extractPlainText(notionLinks.description);
  const category = notionLinks.category || '其他';
  const status = notionLinks.status || 'active';
  const avatar = notionLinks.avatar?.url || '/src/assets/images/PF.png';
  const tags = Array.isArray(notionLinks.tags) ? notionLinks.tags : [];
  const featured = notionLinks.featured || false;
  const sortOrder = notionLinks.sortOrder || 0;

  return {
    id: notionLinks.id,
    name,
    url,
    avatar,
    description,
    tags,
    status,
    category,
    featured,
    sortOrder,
    lastChecked: notionLinks.lastChecked,
    responseTime: notionLinks.responseTime,
    lastEditedTime: notionLinks.lastEditedTime,
    createdTime: notionLinks.createdTime,
  };
}

/**
 * 转换友链数据列表并按分类分组
 * @param {Array} notionLinksData - Notion 友链数据数组
 * @returns {object} 按分类分组的友链数据
 */
export function transformLinksData(notionLinksData) {
  if (!Array.isArray(notionLinksData)) return {};
  
  const transformedItems = notionLinksData
    .map(transformLinksItem)
    .filter(item => item !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder); // 按 sortOrder 排序

  // 按分类分组
  const groupedData = transformedItems.reduce((categories, item) => {
    const category = item.category || '其他';
    if (!categories[category]) {
      categories[category] = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        title: category,
        description: getLinksCategoryDescription(category),
        items: []
      };
    }
    categories[category].items.push(item);
    return categories;
  }, {});

  // 转换为数组格式，匹配现有的数据结构
  return Object.values(groupedData);
}

/**
 * 获取友链分类描述
 * @param {string} category - 分类名称
 * @returns {string} 分类描述
 */
function getLinksCategoryDescription(category) {
  const descriptions = {
    '技术博客': '专注于技术分享和编程开发的优质博客',
    '设计资源': '优秀的设计师博客和设计资源网站',
    '个人博客': '朋友们的个人博客，记录生活与思考',
    '实用工具': '日常开发和生活中常用的在线工具',
    '灵感启发': '激发创意思维和提供灵感的优质内容',
    '其他': '其他类型的链接'
  };
  return descriptions[category] || '其他类型的链接';
}

/**
 * 获取友链统计信息
 * @param {Array} linksData - 友链数据数组
 * @returns {object} 统计信息
 */
export function getLinksStats(linksData) {
  if (!Array.isArray(linksData)) return { total: 0, categories: 0, active: 0 };
  
  const categories = new Set();
  let activeCount = 0;
  
  linksData.forEach(item => {
    categories.add(item.category);
    if (item.status === 'active' || item.status === '正常') {
      activeCount++;
    }
  });

  return {
    total: linksData.length,
    categories: categories.size,
    active: activeCount
  };
}