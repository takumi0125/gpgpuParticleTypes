// localStorage
let isLocalStorageAvailable = true;
let setLocalStorage, getLocalStorage, removeLocalStorage, clearLocalStorage;

if(window.localStorage) {
  try {
    localStorage.setItem('checkIfUseLocalStorage', '1');
    localStorage.removeItem('checkIfUseLocalStorage');
  } catch (err) {
    isLocalStorageAvailable = false;
  }
} else {
  isLocalStorageAvailable = false;
}

if(isLocalStorageAvailable) {
  setLocalStorage = function(key, value) {
    return localStorage.setItem(key, value);
  }
  getLocalStorage = function(key) {
    return localStorage.getItem(key);
  }
  removeLocalStorage = function(key) {
    return localStorage.removeItem(key);
  }
  clearLocalStorage = function() {
    return localStorage.clear();
  }
} else {
  setLocalStorage = function() { return null }
  getLocalStorage = function() { return null }
  removeLocalStorage = function() { return null }
  clearLocalStorage = function() { return null }
}

export { setLocalStorage, getLocalStorage, removeLocalStorage, clearLocalStorage };
