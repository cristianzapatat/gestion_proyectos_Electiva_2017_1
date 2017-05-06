"use strict";

function isNotEmptyNotNull(...values) {
  for (let pos = 0; pos < values.length; pos++) {
    let value = values[pos];
    if (value === undefined || value.length === 0 || value === null) {
      return false;
    }
  }
  return true;
}

exports.isNotEmptyNotNull = isNotEmptyNotNull;
