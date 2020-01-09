const view = document.querySelector("#view"), 
      message = document.querySelector("#message"), 
      buttons = document.querySelector("#buttons"),
      dropDownMenu = document.querySelector("#dropdown-menu");

const signs = ["+", "-", "*", "/", "**", "√"];

let equation = "", 
    lastNumber = "", 
    isLock = false,
    eqToCalc = "",
    endOfN = true;

const handleError = () => {
  message.innerText = "Something went wrong\n press C to continue";
  isLock = true;
}

const handleDataError = () => {
  message.innerText = "Data download error"
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

const calc = equation => {
  if (equation.split("(").length !== equation.split(")").length) equation += ")";

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

getCurrency()
  .then(data => {
    try {
      const [ table ] = data;
      const { rates } = table;
      
      rates.forEach(element => {
        const { code, mid } = element;
        
        let btn = document.createElement("input");
  
        btn.type = "button";
        btn.classList.add("dropdown-item");
        btn.value = `${code} ${mid}`;
  
        dropDownMenu.appendChild(btn);
      });
    } catch {
      handleDataError();
    }
    
  });

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
      eqToCalc = "";
      message.innerText = "";
      break;
    case "CE":
      let isSign = false;

      signs.forEach(element => {
        if (equation.toString().includes(element)) {
          isSign = true;
          equation = equation.split(element)[0];
        }
      });

      signs.forEach(element => {
        if (eqToCalc.toString().includes(element)) {
          isSign = true;
          eqToCalc = equation.split(element)[0];
        }
      });

      if (!isSign) {
        equation = "";
        eqToCalc = "";
      }
      break;
    case "=":
      equation = calc(eqToCalc);
      break;
    default:
      if (sign != null) {
        let currency = false;
        let mid = 0;

        if (sign.split(" ").length === 2) {
          currency = true;
          const tab = sign.split(" ");
          sign = tab[0];
          mid = tab[1];
        }

        const lastSign = equation.split("")[equation.split("").length - 1];

        if (isNaN(lastSign) && isNaN(sign) && typeof lastSign !== 'undefined' && lastSign !== ")" && sign !== "." && sign !== "(") {
          signs.forEach(element => {
            if (lastSign !== element && sign.length !== 3) handleError();
          });
        }

        //addition 0 before comma
        if (lastSign != ".") {
          if (sign === "." && isNaN(lastSign) && lastSign != null) equation += "0";
          if (equation === "" && sign === ".") equation += "0"; 
        } else if (sign === ".") handleError();

        //change √ to x**(1/n)
        if (lastSign === "√") {
          eqToCalc = eqToCalc.substring(0, eqToCalc.length - 1);
          eqToCalc += "**(1/";
          endOfN = false;
        }

        if (!isNaN(lastSign) && isNaN(sign) && endOfN === false) {
          eqToCalc += ")";
          endOfN = true;
        }
    
        equation += sign;
        eqToCalc += sign;

        if (currency) eqToCalc = eqToCalc.replace(sign, `${mid}*`);
      }
      break;
  }

  equation = equation.toString();

  signs.forEach(element => {
    if (element != "-") {
      if (equation.indexOf(element) === 0) handleError();
    }
  });

  view.value = equation;
});