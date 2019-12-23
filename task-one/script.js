const view = document.querySelector("#view");
const message = document.querySelector("#message");
const buttons = document.querySelectorAll("input[type=button]");
const signs = ["+", "-", "*", "/"];
let equation = "";
let lastNumber = "";
const errorMessage = "Something went wrong\n press C to continue";
let i = 0;

buttons.forEach(element => {
  element.addEventListener("click", e => {
    const sign = e.target.value;

    switch (sign) {
      case "C":
        equation = "";
        message.innerText = "";
        break;
      case "CE":
        equation = equation.toString().substring(0, equation.toString().length - 1);
        break;
      case "=":
        try {
          if (eval(equation).toString() == "Infinity") {
            equation = "";
            message.innerText = errorMessage;
          } else equation = eval(equation);
        } catch {
          message.innerText = errorMessage;
        }
        break;
      default:
        signs.forEach(element => {
          if (sign == element) i++;
        });

        if (i > 1) {
          i = 1;
          equation = eval(equation);
          equation += sign;
        } else equation += sign;
        break;
    }      

    if (isNaN(equation) && equation != ".") {
      signs.forEach(element => {
        if (equation.split(element)[1] != null) {
          if (equation.split(element)[1] == "") lastNumber = equation.split(element)[0];
          else lastNumber = equation.split(element)[1];
        }
      });
      view.value = lastNumber;
    } else view.value = equation;
  });
});