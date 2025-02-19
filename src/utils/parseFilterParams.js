// src/utils/parseFilterParams.js

const parseType = (type) => {
  if (typeof type !== 'string') return null;
  const validTypes = ['personal', 'home', 'other'];
  return validTypes.includes(type.toLowerCase()) ? type.toLowerCase() : null;
};

  
  // eslint-disable-next-line no-unused-vars
  const parseNumber = (number) => {
    const isString = typeof number === 'string';
    if (!isString) return;
  
    const parsedNumber = parseInt(number);
    if (Number.isNaN(parsedNumber)) {
      return;
    }
  
    return parsedNumber;
  };
  
  const parseDate = (date) => {
    if(typeof date !== 'string') return null;

    const parsedDate = new Date(date);

    return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

  export const parseFilterParams = (query) => {
    const { name, email, contactType, createdDate, updatedDate } = query;

    return {
      name: typeof name === 'string' ? name.trim() : null,
      email: typeof email ==="string" ? email.trim() : null,
      contactType: parseType(contactType),
      createdDate: parseDate(createdDate),
      updatedDate: parseDate(updatedDate),
    };
};
      