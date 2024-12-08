/**
 * Validates the format of an email address.
 * @param {string} email - The email address to validate.
 @returns {boolean} - Returns true if the email format is valid, false otherwise.
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default validateEmail;
