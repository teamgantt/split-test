'use strict';

/**
 * Gets the root domain of the current domain, prefixed with a '.'
 * to allow for use across subdomains within the root domain.
 *
 * @return {string} The period prefixed value of the root domain
 **/
const getDomain = () => {
  if (typeof window === 'undefined') {
    return '.cli-possibly.local';
  }

  const hostName = window.location.hostname;
  const substringStart =
    hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1;

  return '.' + hostName.substring(substringStart);
};

/**
 * Is the current request https or not.
 *
 * @returns bool
 */
const isHttps = () => {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
};

/**
 * Returns the cookie value of the name provided. If a cookie does not exist
 * `null` is returned.
 *
 * @param {string} name
 * @returns {string|null}
 */
module.exports.getCookie = name => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookieName = name + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieParts = decodedCookie.split(';');

  for (let currentCookiePart of cookieParts) {
    let cookiePart = currentCookiePart;

    while (cookiePart.charAt(0) === ' ') {
      cookiePart = cookiePart.substring(1);
    }

    if (cookiePart.indexOf(cookieName) === 0) {
      return cookiePart.substring(cookieName.length, cookiePart.length);
    }
  }

  return null;
};

/**
 * Saves a cookie to the user's browser.
 *
 * @param {string} cookieName
 * @param {string} cookieValue
 *
 * @returns void
 */
module.exports.saveCookie = (cookieName, cookieValue) => {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = new Date();
  expires.setDate(expires.getDate() + 90);

  const cookieDetails = [
    `${cookieName}=${cookieValue}`,
    `expires=${expires}`,
    'path=/',
    `domain=${getDomain()}`,
    isHttps() ? 'secure=true' : '',
  ].join(';');

  document.cookie = cookieDetails;
};
