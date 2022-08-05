import {
  MOUSE, KEYBOARD, OPERATOR_TRANSLATE,
  OPERATIONS,
} from "./constants.js";

const body = document.querySelector("body");
const inputButtons = document.querySelectorAll("button");
const allClearButton = document.querySelector(".all-clear");
const prevInput = document.querySelector(".prev-input");
const currInput = document.querySelector(".curr-input");

let lhs;
let oper;
let rhs;
let ans;

body.addEventListener("keydown", onCalcKeyboardInput);
inputButtons.forEach(button => button.addEventListener("click", onCalcMouseInput));

function onCalcKeyboardInput(evt) {
  const prevOperation = [lhs, oper, rhs];

  const input = evt.key;
  const state = getCalcState().coreState;

  if (KEYBOARD.numbers.includes(input)) onNumberInput(input, state);
  else if (KEYBOARD.operators.includes(input)) onOperatorInput(translate(input), state);
  else if (KEYBOARD.equals.includes(input)) onEqualsInput(state);
  else if (input === KEYBOARD.decimalSep) onSeparatorInput(state);
  else if (input === KEYBOARD.signToggle) onSignToggleInput(state);
  else if (input === KEYBOARD.backspace) onBackspaceInput(state);
  else if (input === KEYBOARD.allClear) onAllClearInput();

  const newState = getCalcState();
  displayUpdate(newState, ...prevOperation);
}

function onCalcMouseInput(evt) {
  evt.target.blur();

  const prevOperation = [lhs, oper, rhs];
  const input = evt.target.textContent.replace("xy", "^");
  const state = getCalcState().coreState;

  if (MOUSE.numbers.includes(input)) onNumberInput(input, state);
  else if (MOUSE.operators.includes(input)) onOperatorInput(input, state);
  else if (input === MOUSE.equals) onEqualsInput(state);
  else if (input === MOUSE.decimalSep) onSeparatorInput(state);
  else if (input === MOUSE.signToggle) onSignToggleInput(state);
  else if (input === MOUSE.backspace) onBackspaceInput(state);
  else if (input === MOUSE.allClear) onAllClearInput();

  const newState = getCalcState();
  displayUpdate(newState, ...prevOperation);
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

function onSeparatorInput(state) {
  if (state === "start") lhs = "0.";
  else if (state === "lhs" && !lhs.includes(".")) lhs += ".";
  else if (state === "oper") rhs = "0.";
  else if (state === "rhs" && !rhs.includes(".")) rhs += ".";
}

function onSignToggleInput(state) {
  if (state === "lhs")
    lhs = (lhs[0] === "-") ? lhs.slice(1) : `-${lhs}`;
  else if (state === "rhs")
    rhs = (rhs[0] === "-") ? rhs.slice(1) : `-${rhs}`;
}

function onBackspaceInput(state) {
  if (state === "lhs")
    lhs = lhs.match(/^(.|-.)$/) ? undefined : lhs.slice(0, -1);
  else if (state === "oper")
    oper = undefined;
  else if (state === "rhs")
    rhs = rhs.match(/^(.|-.)$/) ? undefined : rhs.slice(0, -1);
}

function onAllClearInput() {
  lhs = oper = rhs = ans = undefined;
}

function displayUpdate(newState, prevL, prevO, prevR) {
  const { coreState, answered } = newState;

  if (coreState === "start") {
    currInput.textContent = "0";
    prevInput.textContent = "";
  } else if (coreState === "lhs") {
    currInput.textContent = lhs;
    if (isUndefined(prevO) && answered) return;
    prevInput.textContent =
      !isUndefined(prevR) && answered
      ? `${prevL} ${prevO} ${prevR} =`
      : "";
  } else if (coreState === "oper") {
    currInput.textContent = "\u200B";
    prevInput.textContent = `${lhs} ${oper}`;
  } else if (coreState === "rhs") {
    currInput.textContent = rhs;
  }
}

function getCalcState() {
  return {
    coreState:
      isUndefined(lhs) ? "start" :
      isUndefined(oper) ? "lhs" :
      isUndefined(rhs) ? "oper" :
      "rhs",
    answered: !isUndefined(ans),
  }
}

function manageAnswer(operClear = false) {
  const mathErrorOccurred = oper === "÷" && +rhs === 0 ||
    +lhs === 0 && oper === "^" && +rhs === 0;

  let result;
  if (mathErrorOccurred) {
    result = "ERROR";
    handleMathError();
  } else {
    result = String(OPERATIONS[oper](+lhs, +rhs).toFixed(12))
      .replace(/(?<!e.+)0+$/, "").replace(/\.$/, "");
  }

  lhs = ans = result;
  rhs = undefined;
  if (operClear) oper = undefined;
}

function handleMathError() {
  inputButtons.forEach(button => button.removeEventListener("click", onCalcMouseInput));
  allClearButton.addEventListener("click", onCalcMouseInput);
  allClearButton.addEventListener("click", reset);

  body.removeEventListener("keydown", onCalcKeyboardInput);
  body.addEventListener("keydown", onCKIOnlyAllClear);
  body.addEventListener("keydown", keyboardReset);
}

function reset() {
  allClearButton.removeEventListener("click", onCalcMouseInput);
  allClearButton.removeEventListener("click", reset);
  inputButtons.forEach(button => button.addEventListener("click", onCalcMouseInput));

  body.removeEventListener("keydown", onCKIOnlyAllClear);
  body.removeEventListener("keydown", reset);
  body.addEventListener("keydown", onCalcKeyboardInput);
}

function onCKIOnlyAllClear(evt) {
  if (evt.key === "c") onCalcKeyboardInput(evt);
}

function keyboardReset(evt) {
  if (evt.key === "c") reset();
}

function translate(oper) {
  return OPERATOR_TRANSLATE[oper] ?? oper;
}

function isUndefined(variable) {
  return typeof variable === "undefined";
}
