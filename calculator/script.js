const view = document.querySelector("#view"), 
      message = document.querySelector("#message"), 
      buttons = document.querySelector("#buttons");

const errorMessage = "Something went wrong\n press C to continue";

const signs = ["+", "-", "*", "/", "**", "√"];

let equation = "", 
    lastNumber = "", 
    isLock = false, 
    indexLastSign = 0;

const handleError = () => {
  message.innerText = errorMessage;
  isLock = true;
}

const calc = equation => {
  if (equation.includes("√")) equation = equation.replace(/√/g, "**1/");

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
    } else sign = "";
  } else sign = e.target.value;

  switch (sign) {
    case "C":
      equation = "";
      message.innerText = "";
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
      break;
    case "=":
      equation = calc(equation);
      break;
    default:
      const lastSign = equation.split("")[equation.split("").length - 1];

      if (lastSign != ".") {
        if (sign === "." && isNaN(lastSign) && lastSign != null) equation += "0";
        if (equation === "" && sign === ".") equation += "0"; 
      } else if (sign === ".") handleError();

      signs.forEach(element => {
        if (lastSign === element) {
          signs.forEach(element => {
            if (element === sign) handleError();
          })
        } 
      });
  
      equation += sign;
      break;
  }

  equation = equation.toString();

  signs.forEach(element => {
    if (element != "-") {
      if (equation.indexOf(element) === 0) handleError();
    }
  });

  signs.forEach(element => {
    if (equation.lastIndexOf(element) > indexLastSign) indexLastSign = equation.lastIndexOf(element);
  });

  if (isNaN(equation[indexLastSign])) lastNumber = equation.substring(indexLastSign + 1, equation.length);
  else lastNumber = equation.substring(indexLastSign, equation.length);

  indexLastSign = 0;

  view.value = lastNumber;
});