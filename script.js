import {
  NUMBERS, OPERATORS, EQUALS, OPERATIONS,
} from "./constants.js";

const inputButtons = document.querySelectorAll("button");
const prevOperation = document.querySelector(".prev-operation");
const currOperation = document.querySelector(".curr-operation");

let lhs;
let oper;
let rhs;
let ans;

inputButtons.forEach(button => button.addEventListener("click", onCalcInput));

function onCalcInput(evt) {
  const prevSet = [lhs, oper, rhs];

  const input = evt.target.textContent;
  const state = getCalcState().coreState;

  if (NUMBERS.includes(input)) onNumberInput(input, state);
  else if (OPERATORS.includes(input)) onOperatorInput(input, state);
  else if (input === EQUALS) onEqualsInput(state);

  const newState = getCalcState();
  displayUpdate(newState, ...prevSet);
}

function onNumberInput(input, state) {
  if (state === "start") lhs = input;
  else if (state === "lhs") lhs += input;
  else if (state === "oper") rhs = input;
  else if (state === "rhs") rhs += input;
}

function onOperatorInput(input, state) {
  if (state === "start") lhs = "0";
  else if (state === "rhs") manageAnswer();
  oper = input;
}

function onEqualsInput(state) {
  if (state === "rhs") manageAnswer(true);
}

function manageAnswer(operClear = false) {
  lhs = ans = OPERATIONS[oper](+lhs, +rhs);
  rhs = undefined;
  if (operClear) oper = undefined;
}

function displayUpdate(newState, prevL, prevO, prevR) {
  const { coreState, answered } = newState;

  if (coreState === "lhs") {
    currOperation.textContent = lhs;
    if (!isDefined(prevO) && answered) return;
    if (answered) prevOperation.textContent = `${prevL} ${prevO} ${prevR} =`
  } else if (coreState === "oper") {
    prevOperation.textContent = `${lhs} ${oper}`;
    if (answered) currOperation.textContent = "\u200B";
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

function isDefined(variable) {
  return typeof variable !== "undefined";
}
