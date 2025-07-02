export const paginate = (page, limit, total, data) => {
    const end = page * limit;
    const result = { data, total };
    if (page > 1)
        result.prev = page-1
    if (end < total)
        result.next = page+1
    return result
}