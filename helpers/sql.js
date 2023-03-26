const { BadRequestError } = require("../expressError");

/**
 * Helper function to convert JavaScript object for partial update into SQL format
 *
 * @param {object} dataToUpdate - JavaScript object containing data to update
 * @param {object} jsToSql - JavaScript object containing column names as keys and their SQL equivalent as values
 * @returns {object} - Returns an object with setCols and values properties
 * @throws {BadRequestError} - Will throw an error if the dataToUpdate object is empty
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // Get an array of keys from dataToUpdate object
  const keys = Object.keys(dataToUpdate);

  // Throw an error if the dataToUpdate object is empty
  if (keys.length === 0) throw new BadRequestError("No data");

  // Map each key to a string in the form of '"column_name"=$1', '"column_name"=$2', etc.
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // Return an object with setCols and values properties
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
