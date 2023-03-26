const { sqlForPartialUpdate } = require("./sql");

test('returns expected setCols and values when given valid input', () => {
  const result = sqlForPartialUpdate(
    { firstName: 'Aliya', age: 32 },
    { firstName: 'first_name', age: 'age' }
  );
  expect(result).toEqual({
    setCols: '"first_name"=$1, "age"=$2',
    values: ['Aliya', 32]
  });
});
