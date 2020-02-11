const view = document.querySelector("#view"),
      message = document.querySelector("#message"), 
      buttons = document.querySelector("#buttons"),
      dropDownMenu = document.querySelector("#dropdown-menu");

let equation = "",
    eqToCalc = "",
    isLock = false,
    endOfN = true,
    error = false,
    isCurrencyValue = false;

const handleError = () => {
  error = true;
  isLock = true;
}

const handleDataError = () => {
  message.innerText = "Data download error\n press C to hide this message";
}

const calc = equation => {
  if (equation.split("(").length !== equation.split(")").length) equation += ")";
  endOfN = true;
  isCurrencyValue = false;

  try {
    if (eval(equation).toString() === "Infinity") {
      handleError();
    } else equation = eval(equation).toString();
  } catch {
    handleError();
  }

  return equation;
}

const isMathSign = str => {
  const signs = ["+", "-", "*", "/", "**", "√"];
  let isMathSign = false;

  signs.forEach(element => {
    if (str === element) isMathSign = true;
  });

  return isMathSign;
}

const lastSign = equation => equation[equation.length - 1];

const deleteLastNumber = equation => {
  if (isMathSign(lastSign(equation))) {
    equation = equation.substring(0, equation.length - 1);
  }
  
  while (!isMathSign(lastSign(equation)) && typeof lastSign(equation) !== "undefined") {
    equation = equation.substring(0, equation.length - 1);
  }

  return equation;
}

const addZero = (equation, sign) => {
  if (lastSign(equation) != ".") {
    if (sign === "." && isNaN(lastSign(equation)) && lastSign(equation) != null) equation += "0";
    if (equation === "" && sign === ".") equation += "0"; 
  } else if (sign === ".") handleError();

  return equation;
}

const getCurrency = async () => {
  const API = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json";

  try {
    const reposne = await fetch(API);
    return await reposne.json();
  } catch {
    handleDataError();
  }
}

const getCurrencyButton = (code, mid) => {
  let btn = document.createElement("a");

  btn.href = "";
  btn.classList.add("dropdown-item");
  btn.innerText = `${code} ${mid}`;

  return btn
}

getCurrency()
  .then(data => {
    try {
      const [ table ] = data;
      const { rates } = table;
      
      rates.forEach(element => {
        const { code, mid } = element;
        
        let btn = getCurrencyButton(code, mid)
  
        dropDownMenu.appendChild(btn);
      });
    } catch {
      handleDataError();
    }
    
  });

buttons.addEventListener("click", e => {
  e.preventDefault();

  let sign = "";
  const targetName = e.target.tagName;

  if (isLock) {
    if (e.target.innerText === "C") {
      sign = e.target.innerText;
      isLock = false;
    } else sign = "";
  } else sign = e.target.innerText;

  switch (sign) {
    case "C":
      equation = "";
      eqToCalc = "";
      message.innerText = "";
      error = false;
      break;
    case "CE":
      equation = deleteLastNumber(equation);
      eqToCalc = deleteLastNumber(eqToCalc);
      break;
    case "=":
      equation = calc(eqToCalc);
      eqToCalc = equation;
      break;
    default:
      if (sign !== null && sign !== "SELECT CURRENCY " && targetName === "BUTTON" || targetName === "A") {
        let currency = false;
        let mid = 0;
        
        if (sign.split(" ").length === 2) {
          currency = true;
          const tab = sign.split(" ");
          sign = tab[0];
          mid = tab[1];
        }

        if (isNaN(lastSign(equation)) && isNaN(sign) && typeof lastSign(equation) !== 'undefined' && lastSign(equation) !== ")" && sign !== "." && sign !== "(") {
          if (isMathSign(lastSign(equation)) && sign.length !== 3) handleError();
        }

        //checking sign before currency
        if (!isNaN(lastSign(equation)) && sign.length === 3) handleError();

        //adding 0 before comma
        equation = addZero(equation, sign);

        //adding * before (
        if (!isNaN(lastSign(equation)) && sign === "(") eqToCalc += "*";

        //adding * after )
        if (lastSign(equation) === ")" && !isNaN(sign)) eqToCalc += "*";

        //change √ to x**(1/n)
        if (lastSign(equation) === "√") {
          eqToCalc = eqToCalc.substring(0, eqToCalc.length - 1);
          eqToCalc += "**(1/";
          endOfN = false;
        }

        if (!isNaN(lastSign(equation)) && isNaN(sign) && endOfN === false) {
          eqToCalc += ")";
          endOfN = true;
        }

        //adding ) after value currency
        if (isCurrencyValue && isMathSign(sign)) {
          eqToCalc += ")";
          isCurrencyValue = false;
        }
    
        equation += sign;
        eqToCalc += sign;

        if (isMathSign(equation[0]) && equation[0] !== "-") handleError();

        if (currency) {
          eqToCalc = eqToCalc.replace(sign, `(${mid}*`);
          isCurrencyValue = true;
        }
      }
      break;
  }

  if (error) view.value = "Error press C to continue";
  else view.value = equation;
});