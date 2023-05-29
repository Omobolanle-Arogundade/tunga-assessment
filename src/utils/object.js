/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
 return keys.reduce((obj, key) => {
  if (object && Object.prototype.hasOwnProperty.call(object, key)) {
   // eslint-disable-next-line no-param-reassign
   obj[key] = object[key];
  }
  return obj;
 }, {});
};

const clean = (obj) => {
 const keys = Object.keys(obj);
 keys.forEach((key) => {
  if (obj[key] === null || obj[key] === undefined) {
   // eslint-disable-next-line no-param-reassign
   delete obj[key];
  }
 });
 return obj;
};

const toArray = (obj) => {
 return Object.keys(obj).map((k) => obj[k]);
};

const toJSON = (obj) => JSON.parse(JSON.stringify(obj));

const average = (array, key) => array.reduce((total, next) => total + next[key], 0) / array.length;

const toLowerCase = (obj) => {
 const result = Object.keys(obj).reduce((prev, current) => ({ ...prev, [current.toLowerCase()]: obj[current] }), {});
 return result;
};

const toUpperCase = (obj) => {
 const result = Object.keys(obj).reduce((prev, current) => ({ ...prev, [current.toUpperCase()]: obj[current] }), {});
 return result;
};

module.exports = { pick, clean, toArray, toJSON, average, toLowerCase, toUpperCase };
