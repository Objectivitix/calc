export const MOUSE = {
  numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  operators: ["+", "-", "×", "÷", "^"],
  equals: "=",
  decimalSep: ".",
  signToggle: "±",
  backspace: "←",
  allClear: "AC",
};

export const KEYBOARD = {
  numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  operators: ["+", "-", "*", "/", "^"],
  equals: ["=", "Enter"],
  decimalSep: ".",
  signToggle: "s",
  backspace: "Backspace",
  allClear: "c",
};

export const OPERATOR_TRANSLATE = {
  "*": "×",
  "/": "÷",
}

export const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "^": (a, b) => a ** b,
};

export const ERROR_VALUES = ["Infinity", "-Infinity", "NaN"];
