import { parseISO, formatISO, getUnixTime, format } from "date-fns";
import { DateObject } from "../types";

export const formatDateObjectForSave = (
  dateObj: DateObject
): { epoch: number; formatted: string } => {
  if (dateObj) {
    const epoch = dateObj?.epoch || 0;
    const formatted = dateObj?.formatted || "";
    return { epoch, formatted };
  }
  return null;
};

/**
 * Parses passed date
 *
 *
 * @memberof Helpers
 * @param {string} dateString - date string to parse
 * @returns {object} - return object
 *  {
 *    date, // - javascript date format
 *    epoch, // - Unix epoch timestamp in seconds
 *    formatted // - Formatted date.  Default "MM-dd-yyyy" or passed in main invokation
 *  }
 */
export function parseToDate(dateString) {
  // if (!dateString || dateString === "") {
  //   return undefined;
  // }
  let theDate = dateString;
  // if (!(dateString instanceof Date)) {
  //   theDate = parseISO(theDate); // date-fns to convert to javascript date object
  // }
  // console.log("the date", getUnixTime(new Date()));
  return {
    epoch: getUnixTime(theDate),
    formatted: format(theDate, "MM-dd-yyyy"),
  }; // Turns the return milliseconds into seconds (unix date)
}

type CurrentDate = {
  epoch: number;
  // ISO standard DATE only string.  Use date-fns parseISO to use in other date-fns functions
  ISO: string;
  formatted: string;
};
export function getCurrentDate(): CurrentDate {
  return {
    epoch: getUnixTime(new Date()),
    ISO: formatISO(new Date(), { representation: "date" }),
    formatted: format(new Date(), "MM-dd-yyyy"),
  };
}
