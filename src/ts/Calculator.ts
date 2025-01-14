interface Operators {
  [key: string]: number;
}

const operators: Operators = {
  "+": 1,
  "-": 2,
  "*": 3,
  "/": 4,
  "%": 5,
};

class Calculator {
  input: string = "";
  output: string = "";

  calculate(logError: boolean, toggle: boolean = false) {
    try {
      const result = eval(this.input);
      if (toggle) {
        this.input = String(result);
        this.output = "";
      } else {
        this.output = result.toString();
      }
    } catch (error) {
      if (logError) {
        this.input = "Error!";
        this.output = "";
      } else {
        this.output = "";
      }
    }
  }

  private checkHasError() {
    if (this.input === "Error!") this.input = "";
  }

  addOperator(char: string, logError = false) {
    this.checkHasError();

    if (char === "+/-") char = "(-";
    else
      char = char
        .replace(/\-\/+/g, "")
        .replace(/\×/g, "*")
        .replace(/\÷/g, "/")
        .replace(/\(-/g, "-");

    const lastIndex = this.input.length - 1;
    const lastChar = this.input[lastIndex];
    const pieces = this.input.split(/[*,\-,\+,\/,\%,\(]/g);
    const lastPiece = pieces[pieces.length - 1];

    if (lastPiece.length === 0 && char === ".") {
      this.input += "0.";
      return;
    }
    if (lastPiece.includes(".") && char === ".") return;

    if (char === "(" || char === "(-") {
      if (
        this.input === "" ||
        (!lastChar.endsWith(".") &&
          Object.prototype.hasOwnProperty.call(operators, lastChar)) ||
        lastChar === "("
      )
        this.input += char;
      else {
        this.input += "*" + char;
      }
    } else if (
      (Object.prototype.hasOwnProperty.call(operators, lastChar) ||
        lastChar === "(" ||
        lastChar === "(-") &&
      char !== ")" &&
      isNaN(Number(char))
    ) {
      if (
        (this.input.endsWith("(-") || this.input.endsWith("(+")) &&
        operators[this.input[lastIndex - 2]] &&
        char !== "-" &&
        char !== "+" &&
        char !== ")"
      ) {
        this.input = this.input.slice(0, lastIndex - 2) + char;
      } else if (
        lastChar === "(" &&
        operators[this.input[lastIndex - 1]] &&
        char !== "+" &&
        char !== "-" &&
        char !== "."
      ) {
        this.input = this.input.slice(0, lastIndex - 1) + char;
      } else if (
        this.input.length > 1 ||
        char === "+" ||
        char === "-"
      ) {
        this.input = this.input.slice(0, lastIndex) + char;
      }
    } else if (
      this.input !== "" ||
      (this.input === "" &&
        (char === "+" || char === "-" || !operators.hasOwnProperty(char)))
    ) {
      this.input +=
        lastChar === ")" &&
        !operators.hasOwnProperty(char) &&
        char !== "(" &&
        char !== ")"
          ? "*" + char
          : char;
    }

    this.calculate(logError);
  }

  get getOriginalInputs() {
    return this.input.replace(/\*/g, "×").replace(/\//g, "÷");
  }

  deleteLastChar(logError = false) {
    this.checkHasError();
    this.input = this.input.slice(0, this.input.length - 1);

    this.calculate(logError);
  }

  deleteAllChars() {
    this.input = "";
    this.output = "";
  }
}

const calculator = new Calculator();
