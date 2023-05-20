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
        removeChildren(inputScreen)
        const inputArray = getInputArray(input)
        for (let inputItem of inputArray) {
            const inputItemType = getCharacterType(inputItem)
            if (inputItemType === "operator") {
                inputScreen.appendChild(getOperatorIcon(inputItem))
            } else {
                const textNode = document.createTextNode(inputItem)
                inputScreen.appendChild(textNode)
            }
        }
    }
    if (result || result === "") {
        resultScreen.textContent = result
    }
}

function deleteLastCharacter(text) {
    let textArray = text.split("")
    textArray.pop()
    let finalText = textArray.join("").trimEnd()
    
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

    return inputArray
}

function removeChildren(element) {
    let child = element.lastChild

    while (child) {
        element.removeChild(child)
        child = element.lastChild
    }
}

function getOperatorIcon(type) {
    const icon = document.createElement("i")
    icon.classList.add("fa-solid")

    switch(type) {
        case "+":
            icon.classList.add("fa-plus")
            break
        
        case "-":
            icon.classList.add("fa-minus")
            break
        
        case "*":
            icon.classList.add("fa-xmark")
            break
        
        case "/":
            icon.classList.add("fa-divide")
    }

    return icon
}

// Keyboard support

document.body.addEventListener("keydown", event => {
    const numbersList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const operatorsList = ["+", "-", "*", "/"]
    const key = event.key
    if (numbersList.includes(key)) {
        const buttonsNumbersArray = Array.from(buttonsNumbers)
        const keyNumber = buttonsNumbersArray.find(buttonNumber => buttonNumber.dataset.number === key)
        keyNumber.click()
    } else if (operatorsList.includes(key)) {
        const buttonsOperatorsArray = Array.from(buttonsOperators)
        const keyOperator = buttonsOperatorsArray.find(buttonOperator => buttonOperator.dataset.operator === key)
        keyOperator.click()
    } else if (key === ".") {
        buttonDecimalPoint.click()
    } else if (key === "=") {
        buttonResult.click()
    } else if (key === "Backspace" && event.ctrlKey) {
        buttonAllClear.click()
    } else if (key === "Backspace") {
        buttonBackspace.click()
    }
})