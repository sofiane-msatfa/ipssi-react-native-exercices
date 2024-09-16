import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

enum Operator {
  Add = "+",
  Subtract = "-",
  Multiply = "x",
  Divide = "÷",
}

enum CalculatorButtonType {
  Function = "function",
  Number = "number",
  Operator = "operator",
  Calculate = "calculate",
}

interface CalculatorButton {
  symbol: string;
  type: CalculatorButtonType;
}

type CalculatorStack = (string | Operator)[];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  displayContainer: {
    width: "90%",
    height: 100,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  displayText: {
    color: "#fff",
    fontSize: 48,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
  },
  buttonText: {
    color: "#000",
    fontSize: 28,
    textAlign: "center",
  },
  button: {
    width: "22%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: "1%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
});

export function Calculator() {
  const INITIAL_DISPLAY = "0";
  const [display, setDisplay] = useState<string>(INITIAL_DISPLAY);
  const [calculatorStack, setCalculatorStack] = useState<CalculatorStack>([]);
  const [currentInput, setCurrentInput] = useState<string>("");

  const buttons: CalculatorButton[] = [
    { symbol: "AC", type: CalculatorButtonType.Function },
    { symbol: "+/-", type: CalculatorButtonType.Function },
    { symbol: "%", type: CalculatorButtonType.Function },
    { symbol: Operator.Divide, type: CalculatorButtonType.Operator },
    { symbol: "7", type: CalculatorButtonType.Number },
    { symbol: "8", type: CalculatorButtonType.Number },
    { symbol: "9", type: CalculatorButtonType.Number },
    { symbol: Operator.Multiply, type: CalculatorButtonType.Operator },
    { symbol: "4", type: CalculatorButtonType.Number },
    { symbol: "5", type: CalculatorButtonType.Number },
    { symbol: "6", type: CalculatorButtonType.Number },
    { symbol: Operator.Subtract, type: CalculatorButtonType.Operator },
    { symbol: "1", type: CalculatorButtonType.Number },
    { symbol: "2", type: CalculatorButtonType.Number },
    { symbol: "3", type: CalculatorButtonType.Number },
    { symbol: Operator.Add, type: CalculatorButtonType.Operator },
    { symbol: "0", type: CalculatorButtonType.Number },
    { symbol: "=", type: CalculatorButtonType.Calculate },
  ];

  const handleInput = (button: CalculatorButton) => {
    switch (button.type) {
      case CalculatorButtonType.Number:
        handleNumberInput(button.symbol);
        break;
      case CalculatorButtonType.Operator:
        handleOperatorInput(button.symbol as Operator);
        break;
      case CalculatorButtonType.Function:
        handleFunctionInput(button.symbol);
        break;
      case CalculatorButtonType.Calculate:
        handleCalculate();
        break;
      default:
        break;
    }
  };

  const handleNumberInput = (num: string) => {
    const updatedInput = currentInput === "0" ? num : currentInput + num;
    setCurrentInput(updatedInput);
    setDisplay([...calculatorStack, updatedInput].join(" "));
  };

  const handleOperatorInput = (op: Operator) => {
    if (currentInput === "" && calculatorStack.length === 0) {
      return;
    }

    if (currentInput === "") {
      const lastInput = calculatorStack[calculatorStack.length - 1];

      if (isOperator(lastInput)) {
        const updatedStack = calculatorStack.slice(0, -1).concat(op);
        setCalculatorStack(updatedStack);
        setDisplay(updatedStack.join(" "));
      }

      return;
    }

    setCalculatorStack([...calculatorStack, currentInput, op]);
    setCurrentInput("");
    setDisplay([...calculatorStack, currentInput, op].join(" "));
  };

  const handleFunctionInput = (func: string) => {
    switch (func) {
      case "AC":
        setCalculatorStack([]);
        setCurrentInput("");
        setDisplay(INITIAL_DISPLAY);
        break;
      case "+/-":
        if (currentInput !== "") {
          const toggledInput = currentInput.startsWith("-")
            ? currentInput.slice(1)
            : "-" + currentInput;
          setCurrentInput(toggledInput);
          setDisplay([...calculatorStack, toggledInput].join(" "));
        }
        break;
      case "%":
        if (currentInput !== "") {
          const percentageValue = (parseFloat(currentInput) / 100).toString();
          setCurrentInput(percentageValue);
          setDisplay([...calculatorStack, percentageValue].join(" "));
        }
        break;
      default:
        break;
    }
  };

  const handleCalculate = () => {
    let expression = structuredClone(calculatorStack);
    if (currentInput !== "") {
      expression.push(currentInput);
    }

    const result = evaluateExpression(expression);
    setDisplay(result);
    setCalculatorStack([]);
    setCurrentInput(result === "Error" ? "" : result);
  };

  const evaluateExpression = (expression: CalculatorStack): string => {
    try {
      // https://www.dcode.fr/reverse-polish-notation
      const outputQueue: (string | Operator)[] = [];
      const operatorStack: Operator[] = [];

      const priorityOrder: { [key in Operator]: number } = {
        [Operator.Add]: 1,
        [Operator.Subtract]: 1,
        [Operator.Multiply]: 2,
        [Operator.Divide]: 2,
      };

      for (const token of expression) {
        if (isOperator(token)) {
          const isLastOperatorHigherPriority =
            priorityOrder[operatorStack[operatorStack.length - 1]] >=
            priorityOrder[token as Operator];

          while (operatorStack.length > 0 && isLastOperatorHigherPriority) {
            outputQueue.push(operatorStack.pop() as Operator);
          }
          operatorStack.push(token as Operator);
        } else {
          outputQueue.push(token);
        }
      }

      while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop() as Operator);
      }

      const stack: number[] = [];
      for (const token of outputQueue) {
        if (isOperator(token)) {
          const b = stack.pop();
          const a = stack.pop();
          if (a === undefined || b === undefined) {
            return "Error";
          }
          let result: number;
          switch (token) {
            case Operator.Add:
              result = a + b;
              break;
            case Operator.Subtract:
              result = a - b;
              break;
            case Operator.Multiply:
              result = a * b;
              break;
            case Operator.Divide:
              if (b === 0) {
                return "Error";
              }
              result = a / b;
              break;
            default:
              return "Error";
          }
          stack.push(result);
        } else {
          stack.push(parseFloat(token as string));
        }
      }

      if (stack.length !== 1) {
        return "Error";
      }
      return stack[0].toString();
    } catch (e) {
      return "Error";
    }
  };

  const isOperator = (token: any): token is Operator => {
    return Object.values(Operator).includes(token);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleInput(button)}
          >
            <Text style={styles.buttonText}>{button.symbol}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
