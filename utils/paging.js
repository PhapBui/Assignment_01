exports.paging = (movies = [], page = 1, pageSize = 20) => {
  const offest = (page - 1) * pageSize;

  const pagiantedItems = movies.slice(offest).slice(0, pageSize);
  const totalPage = Math.ceil(movies.length / pageSize);

  if (!!((0 > page) | ((page > totalPage) & (totalPage > 0))))
    return {
      errCode: -1,
      message: "Please enter a valid page number",
      total_pages: totalPage,
    };
  return {
    results: pagiantedItems,
    page: page || 1,
    total_pages: totalPage,
  };
};
