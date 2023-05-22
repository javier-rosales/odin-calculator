// Global variables

const DECIMAL_PLACES = 3

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

buttonResult.addEventListener("click", updateResult)

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

            if (result) {
                if (characterType === "number") {
                    input = ""
                } else {
                    input = result
                }

                result = ""
            }

            input = addCharacter(characterType, character)
            updateScreen(input, result)
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
        const newInputItems = getExpressionItems(newInput)
        const newInputLastItem = getLastItem(newInputItems)
        if (
            !newInputLastItem.includes(".") &&
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
    result = getResult()

    if (result !== "") {
        updateScreen(false, result)
    }
}

function getResult() {
    const items = getExpressionItems(input)

    // If the first item is a minus sign, join it with the second item
    if (items.length > 1 && items[0] === "-") {
        items.shift()
        items[0] = `-${items[0]}`
    }

    if (
        items.length >= 3 &&
        getCharacterType(getLastItem(items)) === "number" &&
        getLastCharacter(getLastItem(items)) !== "."
    ) {
        let isMD = true // Multiplication or Division
        
        while (items.length > 1) {
            let operator
            let currentIndex

            // Look for multiplications and divisions first
            if (isMD) {
                for (currentIndex = 0; currentIndex < items.length; currentIndex++) {
                    const item = items[currentIndex]
    
                    if (item === "*" || item === "/") {
                        operator = item
                        break
                    }
    
                    if (currentIndex === items.length - 2) {
                        isMD = false // There isn't any multiplication or division left
                        break
                    }
                }
            } else {
                // Look for additions and substractions
                for (currentIndex = 0; currentIndex < items.length; currentIndex++) {
                    const item = items[currentIndex]
                    if (item === "+" || item === "-") {
                        operator = item
                        break
                    }
                }
            }

            if (!operator) continue

            const firstOperand = items[currentIndex - 1]

            const secondOperand = items[currentIndex + 1]

            const currentResult = calculate(operator, firstOperand, secondOperand)

            items[currentIndex - 1] = currentResult // Replace first operand value with currentResult
            items.splice(currentIndex, 1) // Remove current operator from the array
            items.splice(currentIndex, 1) // Run again to remove second operand from the array
        }

        // If the final result is negative, it's resturned in the expression formatting (space between signs and numbers)
        if (items[0] < 0) {
            return `- ${items[0].slice(1)}`
        }

        return items[0]
    }

    return ""
}

function calculate(operator, firstOperand, secondOperand) {
    let result

    switch (operator) {
        case "+":
            result = +firstOperand + +secondOperand
            break
        
        case "-":
            result = +firstOperand - +secondOperand
            break

        case "*":
            result = +firstOperand * +secondOperand
            break
        
        case "/":
            result = +firstOperand / +secondOperand
    }

    return String(roundNumber(result, DECIMAL_PLACES))
}

function roundNumber(number, places) {
    return Math.round(number * (10 ** places)) / 10 ** places
}

// Other functionalities

function updateScreen(input=false, result=false) {
    if (input || input === "") {
        removeChildren(inputScreen)
        const inputItems = getExpressionItems(input)
        insertItems(inputScreen, inputItems)
    }
    if (result || result === "") {
        removeChildren(resultScreen)
        const resultItems = getExpressionItems(result)
        insertItems(resultScreen, resultItems)
    }
}

function insertItems(screen, items) {
    for (let item of items) {
        const itemType = getCharacterType(item)
        if (itemType === "operator") {
            screen.appendChild(getOperatorIcon(item))
        } else {
            const textNode = document.createTextNode(item)
            screen.appendChild(textNode)
        }
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

function getExpressionItems(expression) {
    let expressionItems = expression.split(" ")

    return expressionItems
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