const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
}

export function operate(lhs, oper, rhs) {
  return OPERATIONS[oper](lhs, rhs);
}
