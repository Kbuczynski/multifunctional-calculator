const view = document.querySelector("#view");
const message = document.querySelector("#message");
const buttons = document.querySelector("#buttons");
const errorMessage = "Something went wrong\n press C to continue";
const signs = ["+", "-", "*", "/"];
let equation = "";
let lastNumber = "";
let numberOfSigns = 0;
let isLock = false;

const handleError = () => {
  message.innerText = errorMessage;
  isLock = true;
}

const calc = equation => {
  try {
    if (eval(equation).toString() === "Infinity") {
      equation = "";
      handleError();
    } else equation = eval(equation);
  } catch {
    handleError();
  }

  return equation;
}

buttons.addEventListener("click", e => {
  let sign = "";

  if (isLock) {
    if (e.target.value === "C") {
      sign = e.target.value;
      isLock = false;
    } else sign = null;
  } else sign = e.target.value;

  switch (sign) {
    case "C":
      equation = "";
      message.innerText = "";
      numberOfSigns = 0;
      break;
    case "CE":
      let isSign = false;

      signs.forEach(element => {
        if (equation.toString().includes(element)) {
          equation = equation.split(element)[0];
          isSign = true;
        }
      });

      if (!isSign) equation = "";

      numberOfSigns = 0;
      break;
    case "=":
      equation = calc(equation);
      break;
    default:
      if (sign != null) {
        if (signs.includes(sign)) numberOfSigns++;

        if (numberOfSigns > 1) {
          numberOfSigns = 1;
          equation = calc(equation);
          equation += sign;
        } else {
          const lastSign = equation.split("")[equation.split("").length - 1];

          if (lastSign != ".") {
            if (sign === "." && isNaN(lastSign) && lastSign != null) equation += "0";
            if (equation === "" && sign === ".") equation += "0"; 
          } else if (sign === ".") handleError();

          equation += sign;
        }
      }
      break;
  }

  equation = equation.toString();

  signs.forEach(element => {
    if (element != "-") {
      if (equation.indexOf(element) === 0) handleError();
    }
  });

  if (equation.split(".").length > 4) handleError();

  if (isNaN(equation) && equation != ".") {
    signs.forEach(element => {
      if (element != "-" && equation.includes(element, 0)) {
        if (equation.split(element)[1] != null) {
          if (equation.split(element)[1] === "") lastNumber = equation.split(element)[0];
          else lastNumber = equation.split(element)[1];
        }
      }
    });
    view.value = lastNumber;
  } else view.value = equation;
});