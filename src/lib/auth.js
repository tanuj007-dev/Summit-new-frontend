// Authentication utility functions for cookie-based token management

export const setAuthToken = (token, expiresInDays = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
  
  document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
};

export const getAuthToken = () => {
  const name = 'authToken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
};

export const removeAuthToken = () => {
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const setUserData = (userData) => {
  const userDataString = JSON.stringify(userData);
  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
  
  document.cookie = `userData=${encodeURIComponent(userDataString)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
};

export const getUserData = () => {
  const name = 'userData=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      try {
        return JSON.parse(decodeURIComponent(cookie.substring(name.length, cookie.length)));
      } catch (e) {
        console.error('Error parsing user data from cookie:', e);
        return null;
      }
    }
  }
  return null;
};

export const removeUserData = () => {
  document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const clearAuthCookies = () => {
  removeAuthToken();
  removeUserData();
};
