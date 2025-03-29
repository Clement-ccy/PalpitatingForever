// 获取数据库内容
// export const getDatabase = async (databaseId, filters = {}) => {
export const getDatabase = async (databaseId) => {
  const response = await fetch(`/notion-api/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: {
    //   filter: filters,
    // },
  });
  const data = await response.json()
  return data.results;
};

// 获取页面内容
export const getPage = async (pageId) => {
  const [page, blocks] = await Promise.all([
    fetch(`/notion-api/v1/pages/${pageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
    fetch(`/notion-api/v1/blocks/${pageId}/children`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  ]);
  return { page, blocks };
};
