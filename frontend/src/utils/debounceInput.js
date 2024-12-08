/**
 * Creates a debounced version of a function.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - Returns the debounced function.
 */
const debounceInput = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("Debouse function called...");
      func(...args);
    }, delay);
  };
};

export default debounceInput;
