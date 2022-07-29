import {
  NUMBERS, DECI_SEP, OPERATORS, EQUALS,
  PLUS_MINUS, BACKSPACE, ALL_CLEAR, OPERATIONS,
} from "./constants.js";

const inputButtons = document.querySelectorAll("button");
const allClearButton = document.querySelector(".all-clear");
const prevOperation = document.querySelector(".prev-operation");
const currOperation = document.querySelector(".curr-operation");

let lhs;
let oper;
let rhs;
let ans;

inputButtons.forEach(button => button.addEventListener("click", onCalcInput));

function onCalcInput(evt) {
  const prevSet = [lhs, oper, rhs];

  const input = evt.target.textContent.replace("xy", "^");
  const state = getCalcState().coreState;

  if (NUMBERS.includes(input)) onNumberInput(input, state);
  else if (input === DECI_SEP) onSeparatorInput(input, state);
  else if (OPERATORS.includes(input)) onOperatorInput(input, state);
  else if (input === EQUALS) onEqualsInput(state);
  else if (input === PLUS_MINUS) onPlusMinusInput(state);
  else if (input === BACKSPACE) onBackspaceInput(state);
  else if (input === ALL_CLEAR) onAllClearInput();

  if (ans === "ERROR") handleMathError();

  const newState = getCalcState();
  displayUpdate(newState, ...prevSet);
}

function onNumberInput(input, state) {
  if (state === "start") lhs = input;
  else if (state === "lhs") lhs += input;
  else if (state === "oper") rhs = input;
  else if (state === "rhs") rhs += input;
}

function onSeparatorInput(input, state) {
  if (state === "start") lhs = "0.";
  else if (state === "lhs" && !lhs.includes(input)) lhs += input;
  else if (state === "oper") rhs = "0.";
  else if (state === "rhs" && !rhs.includes(input)) rhs += input;
}

function onOperatorInput(input, state) {
  if (state === "start") lhs = "0";
  else if (state === "rhs") manageAnswer();
  oper = input;
}

function onEqualsInput(state) {
  if (state === "rhs") manageAnswer(true);
}

function onPlusMinusInput(state) {
  if (state === "lhs")
    lhs = (lhs[0] === "-") ? lhs.slice(1) : `-${lhs}`;
  else if (state === "rhs")
    rhs = (rhs[0] === "-") ? rhs.slice(1) : `-${rhs}`;
}

function onBackspaceInput(state) {
  if (state === "lhs")
    lhs = (lhs.length === 1) ? undefined : lhs.slice(0, -1);
  else if (state === "oper")
    oper = undefined;
  else if (state === "rhs")
    rhs = (rhs.length === 1) ? undefined : rhs.slice(0, -1);
}

function onAllClearInput() {
  lhs = oper = rhs = ans = undefined;
}

function displayUpdate(newState, prevL, prevO, prevR) {
  const { coreState, answered } = newState;

  if (coreState === "start") {
    currOperation.textContent = "0";
    prevOperation.textContent = "";
  } else if (coreState === "lhs") {
    currOperation.textContent = lhs;
    if (!isDefined(prevO) && answered) return;
    prevOperation.textContent =
      (isDefined(prevR) && answered)
      ? `${prevL} ${prevO} ${prevR} =`
      : "";
  } else if (coreState === "oper") {
    currOperation.textContent = "\u200B";
    prevOperation.textContent = `${lhs} ${oper}`;
  } else if (coreState === "rhs") {
    currOperation.textContent = rhs;
  }
}

function getCalcState() {
  return {
    coreState: getCalcCoreState(),
    answered: isDefined(ans),
  }
}

function getCalcCoreState() {
  if (!isDefined(lhs)) return "start";
  else if (!isDefined(oper)) return "lhs";
  else if (!isDefined(rhs)) return "oper";
  else return "rhs";
}

function manageAnswer(operClear = false) {
  const error = oper === "÷" && +rhs === 0 ||
    +lhs === 0 && oper === "^" && +rhs === 0;

  const result = (error) ? "ERROR" :
    String(OPERATIONS[oper](+lhs, +rhs).toFixed(12))
      .replace(/0+$/, "").replace(/\.$/, "");

  lhs = ans = result;
  rhs = undefined;
  if (operClear) oper = undefined;
}

function handleMathError() {
  inputButtons.forEach(button => button.removeEventListener("click", onCalcInput));
  allClearButton.addEventListener("click", onCalcInput);
  allClearButton.addEventListener("click", function cleanUp() {
    inputButtons.forEach(button => button.addEventListener("click", onCalcInput));
    allClearButton.removeEventListener("click", cleanUp);
  })
}

function isDefined(variable) {
  return typeof variable !== "undefined";
}
