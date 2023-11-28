export const textOnlyRegx = /^[A-Za-zåäöÅÄÖ\s]+$/;
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const telephoneRegex =
  /^\+?[0-9]{1,4}?[-. ]?(\([0-9]{1,3}\)|[0-9]{1,4})[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,9}$/;
export const numberOnlyRegex = /^[0-9]+$/;
export const socialSecurityRegex = /\d{6}-\d{4}/;
export const addressRegex = /\w+ \w+(?:[-' \w]*)*(?:,? \w+)?/;
