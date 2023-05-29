const toSentenceCase = (text) => {
 const result = text.replace(/([A-Z])/g, ' $1');
 return result.charAt(0).toUpperCase() + result.slice(1);
};

const checkMileStone = (number) => {
 const toString = number.toString();
 const length = toString.length - 1;
 return toString.substr(1) === '0'.repeat(length);
};

module.exports = { toSentenceCase, checkMileStone };
