function validateQueryParams(query, allowedParams) {
    const queryParams = Object.keys(query);
  
    for (const param of queryParams) {
      if (!allowedParams.includes(param)) {
        return false;
      }
    }
    return true;
  }
  
module.exports = { validateQueryParams };