import { parsePhoneNumberFromString } from "libphonenumber-js";

const validateMobileNumber = (phoneNumber) => {
  const phoneNumberInstance = parsePhoneNumberFromString(phoneNumber);
  if (phoneNumberInstance && phoneNumberInstance.isValid()) {
    return true;
  } else {
    return false;
  }
};

export default validateMobileNumber;
