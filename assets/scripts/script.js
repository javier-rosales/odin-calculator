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
        const number = event.target.dataset.number
        updateInput("add-character", number)
    })
})

buttonsOperators.forEach(buttonOperator => {
    buttonOperator.addEventListener("click", event => {
        const operator = event.currentTarget.dataset.operator
        updateInput("add-character", operator)
    })
})

buttonResult.addEventListener("click", () => updateResult())

// Functionalities for input actions

function updateInput(command, commandValue="") {
    switch(command) {
        case "all-clear":
            input = ""
            result = ""
            updateScreen(input, result)
            break
        case "backspace":
            input = deleteLastCharacter(input)
            result = ""
            updateScreen(input, result)
            break
        case "add-character":
            const character = commandValue
            const characterType = getCharacterType(character)
            input = addCharacter(characterType, character)
            updateScreen(input)
    }
}

function addCharacter(type, content) {
    let newInput = input
    const inputLastCharacter = getLastCharacter(newInput)
    const inputLastCharacterType = getCharacterType(inputLastCharacter)

    if (type === "number") {
        if (
            inputLastCharacterType === "empty" ||
            inputLastCharacterType === "number" ||
            inputLastCharacterType === "decimal-point"
        ) {
            newInput += content
        } else { // inputLastCharacterType = "operator"
            newInput += ` ${content}`
        }
    } else if (type === "operator") {
        if (
            inputLastCharacterType === "empty" &&
            content === "-"
        ) {
            newInput += content
        } else if (inputLastCharacterType === "number") {
            newInput += ` ${content}`
        }
    } else { // type = "decimal-point"
        const newInputArray = getInputArray(newInput)
        const newInputArrayLastItem = getLastItem(newInputArray)
        if (
            !newInputArrayLastItem.includes(".") &&
            (inputLastCharacterType === "empty" ||
            inputLastCharacterType === "number")
        ) {
            newInput += content
        } else if (inputLastCharacterType === "operator") {
            newInput += ` ${content}`
        }
    }

    return newInput
}

function getCharacterType(character) {
    if (character === "") {
        return "empty"
    }
    if (!isNaN(+character)) {
        return "number"
    }
    if (
        character === "+" ||
        character === "-" ||
        character === "*" ||
        character === "/"
    ) {
        return "operator"
    }
    return "decimal-point"
}

// Functionalities for getting result actions

function updateResult() {
    // ...
}

// Other functionalities

function updateScreen(input=false, result=false) {
    if (input || input === "") {
        inputScreen.textContent = input
    }
    if (result || result === "") {
        resultScreen.textContent = result
    }
}

function deleteLastCharacter(text) {
    let textArray = text.split("")
    textArray.pop()
    let finalText = textArray.join("")
    
    return finalText
}

function getLastCharacter(string) {
    return string.slice(-1)
}

function getLastItem(array) {
    return array.slice(-1)[0]
}

function getInputArray(input) {
    let inputArray = input.split(" ")
    
    if (inputArray[0] === "-") {
        inputArray.shift()
        inputArray[0] = `-${inputArray[0]}`
    }

    return inputArray
}