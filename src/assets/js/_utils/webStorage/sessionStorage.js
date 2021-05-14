// sessionStorage
let isSessionStorageAvailable = true;
let setSessionStorage, getSessionStorage, removeSessionStorage, clearSessionStorage;

if(window.sessionStorage) {
  try {
    sessionStorage.setItem('checkIfUseSessionStorage', '1');
    sessionStorage.removeItem('checkIfUseSessionStorage');
  } catch (err) {
    isSessionStorageAvailable = false;
  }
} else {
  isSessionStorageAvailable = false;
}

if(isSessionStorageAvailable) {
  setSessionStorage = function(key, value) {
    return sessionStorage.setItem(key, value);
  }
  getSessionStorage = function(key) {
    return sessionStorage.getItem(key);
  }
  removeSessionStorage = function(key) {
    return sessionStorage.removeItem(key);
  }
  clearSessionStorage = function() {
    return sessionStorage.clear();
  }
} else {
  setSessionStorage = function() { return null }
  getSessionStorage = function() { return null }
  removeSessionStorage = function() { return null }
  clearSessionStorage = function() { return null }
}

export { setSessionStorage, getSessionStorage, removeSessionStorage, clearSessionStorage };
