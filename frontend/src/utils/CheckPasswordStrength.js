export const checkPasswordStrength = (password) => {
  if (!password) return "";

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  let strength = 0;
  if (password.length >= minLength) strength++;
  if (password.length > 12) strength++;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasNonalphas) strength++;

  switch (strength) {
    case 5:
      return "Very strong password!";
    case 4:
      return "Strong password!";
    case 3:
      return "Medium password!";
    case 2:
      return "Weak password!";
    default:
      return "Very weak password!";
  }
};
