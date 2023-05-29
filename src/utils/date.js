const httpStatus = require('http-status');
const ApiError = require('./ApiError');
const { dateFilters } = require('./constants');
const { toArray } = require('./object');

/* eslint-disable no-extend-native */
Date.prototype.dayOfYear = function () {
 const j1 = new Date(this);
 j1.setMonth(0, 0);
 return Math.round((this - j1) / 8.64e7);
};

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
 /* getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

 // eslint-disable-next-line no-param-reassign
 dowOffset = typeof dowOffset === 'number' ? dowOffset : 0; // default dowOffset to zero
 const newYear = new Date(this.getFullYear(), 0, 1);
 let day = newYear.getDay() - dowOffset; // the day of week the year begins on
 day = day >= 0 ? day : day + 7;
 const daynum =
  Math.floor(
   (this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / (86400 * 1000)
  ) + 1;
 let weeknum;
 // if the year starts before the middle of a week
 if (day < 4) {
  weeknum = Math.floor((daynum + day - 1) / 7) + 1;
  if (weeknum > 52) {
   const nYear = new Date(this.getFullYear() + 1, 0, 1);
   let nday = nYear.getDay() - dowOffset;
   nday = nday >= 0 ? nday : nday + 7;
   /* if the next year starts before the middle of
              the week, it is week #1 of that year */
   weeknum = nday < 4 ? 1 : 53;
  }
 } else {
  weeknum = Math.floor((daynum + day - 1) / 7);
 }
 return weeknum;
};

const getDay = (date) => new Date(date).dayOfYear();

const getWeek = (date) => new Date(date).getWeek();

const getMonth = (date) => new Date(date).getMonth() + 1;

const getYear = (date) => new Date(date).getFullYear();

const getWeeksInMonth = (month, year) => {
 const firstWeek = new Date(year, month - 1, 1).getWeek();
 const lastWeek = new Date(year, month, 0).getWeek();
 const weeks = [];

 for (let i = firstWeek; i <= lastWeek; i += 1) if (i !== 0) weeks.push(i);

 return weeks;
};

/**
 *  Returns the filter object for dates filter
 * @param {*} filter
 * @param {*} date
 * @returns
 */
const dateFilter = (filter, date = new Date()) => {
 switch (filter) {
  case dateFilters.TODAY: {
   return {
    day: getDay(date),
    year: getYear(date),
   };
  }

  case dateFilters.THIS_WEEK: {
   return {
    week: getWeek(date),
    year: getYear(date),
   };
  }

  case dateFilters.THIS_MONTH: {
   return {
    month: getMonth(date),
    year: getYear(date),
   };
  }

  case dateFilters.THIS_YEAR: {
   return {
    year: getYear(date),
   };
  }

  default: {
   if (filter && typeof filter === 'string') {
    const [from, to] = filter.split('||');

    if (from && to && !Number.isNaN(new Date(from).getTime()) && !Number.isNaN(new Date(to).getTime())) {
     return {
      createdAt: {
       $gte: new Date(from),
       $lt: new Date(to),
      },
     };
    }
    throw new ApiError(
     httpStatus.BAD_REQUEST,
     `time format is invalid. Should be ${toArray(dateFilters).join(', ')} or a date range`,
     true
    );
   }
  }
 }
};

module.exports = { getDay, getWeek, getMonth, getYear, dateFilter, getWeeksInMonth };
