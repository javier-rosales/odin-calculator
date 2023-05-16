// Global variables

let input = ""
let result = ""

const inputScreen = document.querySelector(".screen__input")
const resultScreen = document.querySelector(".screen__result")
const buttonAllClear = document.querySelector(".button.all-clear")
const buttonBackspace = document.querySelector(".button.backspace")
const buttonDecimalPoint = document.querySelector(".button.decimal-point")
const buttonsNumbers = document.querySelectorAll(".button.number")
const buttonsOperators = document.querySelectorAll(".button.operator")
const buttonResult = document.querySelector(".button.result")

// Add event listeners to calculator buttons

buttonAllClear.addEventListener("click", () => updateInput("all-clear"))
buttonBackspace.addEventListener("click", () => updateInput("backspace"))

buttonDecimalPoint.addEventListener("click", () => updateInput("add-character", "."))

buttonsNumbers.forEach(buttonNumber => {
    buttonNumber.addEventListener("click", event => {
        number = event.target.dataset.number
        updateInput("add-character", number)
    })
})

buttonsOperators.forEach(buttonOperator => {
    buttonOperator.addEventListener("click", event => {
        operator = event.target.dataset.operator
        updateInput("add-character", operator)
    })
})

buttonResult.addEventListener("click", () => updateResult())