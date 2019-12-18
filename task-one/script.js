const view = document.querySelector("#view");
const buttons = document.querySelectorAll("button");
const arr = [];

const calc = arr => {
  let number = "";
  const numbers = [];
  let result = 0;
  let i = 0;

  arr.forEach(element => {
    if (!isNaN(element) || element == ".") {
      number += element.toString();
      numbers[i] = number;
    } else {
      number = "";
      i++;
      console.log(i);

      if (numbers.length > 1) {
        switch (element) {
          case "+":
            break;
          case "-":
            break;
          case "*":
            break;
          case "/":
            break;
          default:
            break;
        }
      }
    }
  });

  console.log(numbers);
  console.log(`Result: ${result}`);
};

buttons.forEach(element => {
  element.addEventListener("click", e => {
    const sign = e.target.innerText;

    if (sign.toString().length < 3) {
      if (!isNaN(sign)) arr.push(parseFloat(e.target.innerText));
      else {
        switch (sign) {
          case "C":
            arr.splice(0, arr.length);
            break;
          case "CE":
            arr.pop();
            break;
          case "=":
            calc(arr);
            break;
          default:
            arr.push(sign);
            break;
        }
      }
    }

    view.value = arr.toString().replace(/,/g, "");
  });
});
