import { operate } from "./utils.js";

const NUMBERS = Array.from(Array(10), (v, i) => String(i));
const OPERATORS = ["+", "-", "×", "÷"]

const inputButtons = document.querySelectorAll("button");
const prevOperation = document.querySelector(".prev-operation");
const currOperation = document.querySelector(".curr-operation");

let lhs;
let oper;
let rhs;
let ans;

let answered = false;
let noOperation = false;

inputButtons.forEach(button => button.addEventListener("click", onCalcInput));

function onCalcInput(evt) {
  const prevSet = [lhs, oper, rhs];
  noOperation = false;

  const input = evt.target.textContent;
  const state = getCalcState();

  if (NUMBERS.includes(input)) onNumberInput(input, state);
  else if (OPERATORS.includes(input)) onOperatorInput(input, state);
  else if (input === "=") onEqualsInput(state);

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
  else noOperation = true;
}

function displayUpdate(newState, prevL, prevO, prevR) {
  if (noOperation) return;

  if (newState === "lhs") {
    currOperation.textContent = lhs;
    if (answered) prevOperation.textContent = `${prevL} ${prevO} ${prevR} =`
  } else if (newState === "oper") {
    prevOperation.textContent = `${lhs} ${oper}`;
    if (answered) currOperation.textContent = "\u200B";
  } else if (newState === "rhs") {
    currOperation.textContent = rhs;
  }
}

function getCalcState() {
  if (typeof lhs === "undefined") return "start";
  else if (typeof oper === "undefined") return "lhs";
  else if (typeof rhs === "undefined") return "oper";
  else return "rhs";
}

function manageAnswer(operClear = false) {
  lhs = ans = operate(+lhs, oper, +rhs);
  rhs = undefined;
  if (operClear) oper = undefined;
  answered = true;
}
