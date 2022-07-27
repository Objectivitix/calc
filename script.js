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

inputButtons.forEach(button => button.addEventListener("click", onCalcInput));

function onCalcInput(evt) {
  const input = evt.target.textContent;
  const state = getCalcState();

  if (NUMBERS.includes(input)) onNumberInput(input, state);
  else if (OPERATORS.includes(input)) onOperatorInput(input, state);
  else if (input === "=") onEqualsInput(state);

  const newState = getCalcState();
  displayUpdate(newState);
}

function onNumberInput(input, state) {
  if (state === "start") lhs = input;
  else if (state === "lhs") lhs += input;
  else if (state === "oper") rhs = input;
  else if (state === "rhs") rhs += input;
}

function onOperatorInput(input, state) {
  if (state === "start") {
    lhs = "0";
  } else if (state === "rhs") {
    lhs = ans = getAnswer();
    rhs = undefined;
  }

  oper = input;
}

function onEqualsInput(state) {
  if (state === "rhs") {
    lhs = ans = getAnswer();
    oper = rhs = undefined;
  }
}

function displayUpdate(newState) {
  if (newState === "lhs") {
    currOperation.textContent = lhs;
  } else if (newState === "oper") {
    prevOperation.textContent = `${lhs} ${oper}`;
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

function getAnswer() {
  return operate(+lhs, oper, +rhs);
}
