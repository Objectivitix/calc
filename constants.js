export const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const OPERATORS = ["+", "-", "×", "÷", "^"];
export const EQUALS = "=";
export const DECI_SEP = ".";
export const SIGN_TOGGLE = "±";
export const BACKSPACE = "←";
export const ALL_CLEAR = "AC";

export const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "^": (a, b) => a ** b,
};
