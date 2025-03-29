// 解析 Notion 页面标题
export const getTitle = (page) => {
  // 假设标题存储在 "Title" 属性中
  return page.properties?.Name?.title?.[0]?.plain_text || "Untitled";
};

// 解析标签
export const getTags = (page) => {
  // 假设标签存储在 "Tags" 多选属性中
  return page.properties?.Categories?.select?.name;
};

// 格式化日期
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
