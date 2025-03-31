// Define Regex Patterns for Common Credit Cards
const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
const mastercardRegex = /^5[1-5][0-9]{14}$/;
const amexRegex = /^3[47][0-9]{13}$/;

// Function to validate and identify card type
export const identifyCardType = (cardNumber: string): string => {
  if (visaRegex.test(cardNumber)) {
    return 'visa';
  } else if (mastercardRegex.test(cardNumber)) {
    return 'mastercard';
  } else if (amexRegex.test(cardNumber)) {
    return 'amex';
  } else {
    return 'Unknown';
  }
}

export const cardTypeImages: Record<string, any> = {
  visa: require("@/assets/images/cardtype/visa.png"),
  mastercard: require("@/assets/images/cardtype/mastercard.png"),
  amex: require("@/assets/images/cardtype/amex.png"),
  // Add other card types as needed
};