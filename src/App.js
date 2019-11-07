import React, { Component } from 'react';
import './App.css';
import CalcButton from './CalcButton';
import Display from './Display';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const OPERATIONS = ['-', '+', '/', 'x'];

class App extends Component {
  state = {
    buttons: [
      {
        display: "AC",
        id: "clear"
      },
      {
        display: "<-",
        id: "backspace"
      },
      {
        display: "/",
        id: "divide"
      },
      {
        display: 7,
        id: "seven"
      },
      {
        display: 8,
        id: "eight"
      },
      {
        display: 9,
        id: "nine"
      },
      {
        display: "x",
        id: "multiply"
      },
      {
        display: 4,
        id: "four"
      },
      {
        display: 5,
        id: "five"
      },
      {
        display: 6,
        id: "six"
      },
      {
        display: "-",
        id: "subtract"
      },
      {
        display: 1,
        id: "one"
      },
      {
        display: 2,
        id: "two"
      },
      {
        display: 3,
        id: "three"
      },
      {
        display: "+",
        id: "add"
      },
      {
        display: 0,
        id: "zero"
      },
      {
        display: ".",
        id: "decimal"
      },
      {
        display: "=",
        id: "equals"
      },
    ],
    currentDisplay: "0"
  };

  currInputIndex =  0;
  currDecimals = 0;
  equationPieces = [];

  buildEquationPart = (userInput) => {
    if (this.equationPieces.length === 0) {
      const newOperand = parseFloat(this.state.currentDisplay);
      const newOperation = userInput;
      const newEquationPiece = {
        operand: newOperand,
        operator: newOperation
      }
      this.equationPieces.push(newEquationPiece);
      this.currInputIndex++;
    } else {
      const lastOperation = this.equationPieces[this.currInputIndex-1].operator;
      const lastOperationIndex = this.state.currentDisplay.lastIndexOf(lastOperation);
      const newOperand = parseFloat(this.state.currentDisplay.slice(lastOperationIndex+1));
      const newOperation = userInput;
      if (isNaN(newOperand)) {
        // If two operators are entered in a row and one is NOT subtraction/minus sign, ignore the first operator
        if (OPERATIONS.includes(userInput) && userInput !== '-') {
          this.equationPieces[this.currInputIndex-1].operator = userInput;
        }
      } else {
        const newEquationPiece = {
          operand: newOperand,
          operator: newOperation
        }
        this.equationPieces.push(newEquationPiece);
        this.currInputIndex++;
      }
    }
    this.currDecimals = 0;
  }

  concatUserInput = (inpt) => {
    let prevInput = this.state.currentDisplay.toString();
    let newInput = inpt.toString();
    if (prevInput.length === 1 && prevInput === "0" && newInput === "0") {
      //Keeps display at one 0 if user is entering multiple 0s
      this.setState({currentDisplay: "0"});
    } else if (prevInput.length === 1 && prevInput === "0" && OPERATIONS.includes(newInput) && (newInput !== '-')) {
      //Doesn't allow first user input to be an operator, except for a minus sign to denote a negative number
      this.setState({currentDisplay: "0"});
    } else if (prevInput.length === 1 && prevInput === "0" && newInput !== "0") {
      //Removes initial 0 when user starts entering numbers
      this.setState({currentDisplay: newInput});
    } else if (OPERATIONS.includes(prevInput.slice(-2, -1)) && prevInput.slice(-1) === "0" && !OPERATIONS.includes(newInput)) {
      //Removes initial 0 if user continues to type a number. EXAMPLE: 12 + 01 becomes 12 + 1
      //Keeps a zero if an operator immediately follows. EXAMPLE: 12 + 0 + 1, the 0 is retained
      prevInput = prevInput.slice(0, -1);
      const newDisplay = prevInput.concat('', newInput);
      this.setState({currentDisplay: newDisplay});
    } else {
      if (newInput === ".") {
        //Checks that Decimals are only allowed to have one decimal point
        //If more than one decimal is entered in a single number, subsequent decimals are ignored
        this.currDecimals++;
          if (this.currDecimals > 1) {
            newInput = "";
          }
      }
      const newDisplay = prevInput.concat('', newInput);
      this.setState({currentDisplay: newDisplay});
    }
  }

  evaluate = (operand1, operator, operand2) => {
    if (operator === 'x') {
      return operand1 * operand2;
    } else if (operator === '/') {
      if (operand2 === 0) {
        return "No division by 0";
      }
      return operand1 / operand2;
    } else if (operator === '+') {
      return operand1 + operand2;
    } else if (operator === '-') {
      return operand1 - operand2;
    }
  }

  handleClearDisplay = () => {
    this.setState({currentDisplay: "0"});
    this.equationPieces = [];
    this.currInputIndex = 0;
    this.currDecimals = 0;
  }

  handleBackspace = () => {
    let backOneDisplay = this.state.currentDisplay.slice(0, -1);
    if (backOneDisplay.length < 1) {
      backOneDisplay = "0";
    }
    this.setState({currentDisplay: backOneDisplay});
  }

  handleEvaluate = () => {
    let answer = null;
    let evalArray = [];
    for (let i = 0; i < this.equationPieces.length; i++) {
      if (this.equationPieces[i].operator === 'x' || this.equationPieces[i].operator === '/') {
        const operandOne = this.equationPieces[i].operand;
        const operator = this.equationPieces[i].operator;
        const operandTwo = this.equationPieces[i+1].operand;
        const tempAns = this.evaluate(operandOne, operator, operandTwo);
        if (tempAns === "No division by 0") {
          evalArray = [];
          answer = null;
          this.setState({currentDisplay: tempAns});
          this.equationPieces = [];
          this.currInputIndex = 0;
          this.currDecimals = 0;
          break;
        } else if (tempAns === Infinity) {
          evalArray = [];
          answer = null;
          this.setState({currentDisplay: "Bad expression"});
          this.equationPieces = [];
          this.currInputIndex = 0;
          this.currDecimals = 0;
          break;
        } else {
          evalArray.push(tempAns);
          evalArray.push(this.equationPieces[i+1].operator);
          i++;
        }
      } else {
        evalArray.push(this.equationPieces[i].operand);
        evalArray.push(this.equationPieces[i].operator);
      }
    }
    
    if (evalArray.length > 0) {
      if (evalArray.length === 2 || evalArray[1] === '=') {
        answer = evalArray[0];
      } else {
        answer = this.evaluate(evalArray[0], evalArray[1], evalArray[2]);
      }

      if (evalArray.length > 4) {
        for (let j = 3; j < evalArray.length-1; j += 2) {
          answer = this.evaluate(answer, evalArray[j], evalArray[j+1]);
        }
      }
      // Decimals intentionally not reset so that user cannot create a number with more than one decimal point
      this.equationPieces = [];
      this.currInputIndex = 0;
      this.setState({currentDisplay: answer});
    }
  }

  handleUserInput = (evt) => {
    const targetId = evt.target.id;
    let targetContent = evt.target.firstChild.nodeValue;
    if (targetId === "backspace" || targetId === "clear" || targetId === "equals") {
      if (targetId === "clear") {
        this.handleClearDisplay();
      } else if (targetId === "backspace") {
        this.handleBackspace();
      } else if (targetId === "equals") {
        this.buildEquationPart('=');
        this.handleEvaluate();
      }
    } else if (targetContent === "0" || targetContent === 0) {
      if (OPERATIONS.includes(this.state.currentDisplay.slice(-1))) {
        //Strips initial 0s
        while (targetContent.length > 1 && targetContent[0] === "0") {
          targetContent = targetContent.slice(1);
        }
      }
      this.concatUserInput(targetContent);
    } else if (OPERATIONS.includes(targetContent)) {
      // Check for whether a negative number is being created
      // If no negative number is being created, build an equation part
      if (this.state.currentDisplay.length === 1 && this.state.currentDisplay === '0' && this.equationPieces.length === 0 && targetContent === '-') {
        this.concatUserInput(targetContent);
      } else if (OPERATIONS.includes(this.state.currentDisplay[-1]) && targetContent === '-') {
        this.concatUserInput(targetContent);
      } else {
        this.buildEquationPart(targetContent);
        this.concatUserInput(targetContent);
      }
    } else {
      this.concatUserInput(targetContent);
    } 
  }

  render() {
    return (
      <Container id="calculator">
        <Display 
          userInput={this.state.currentDisplay}
        />
        <Row className="calc-row" id="calc-row-1">
        {this.state.buttons.filter( (btn, index) => index < 3).map( (btn, index) => 
          <CalcButton 
            name={btn.display}
            id={btn.id}
            key={btn.id}
            userInput={this.handleUserInput}
          />
        )}
        </Row>
        <Row className="calc-row" id="calc-row-2">
          {this.state.buttons.filter( (btn, index) => index >= 3 && index < 7).map( (btn, index) => 
            <CalcButton 
              name={btn.display}
              id={btn.id}
              key={btn.id}
              userInput={this.handleUserInput}
            />  
          )}
        </Row>
        <Row className="calc-row" id="calc-row-3">
          {this.state.buttons.filter( (btn, index) => index >= 7 && index < 11).map( (btn, index) =>
            <CalcButton 
              name={btn.display}
              id={btn.id}
              key={btn.id}
              userInput={this.handleUserInput}
            />
          )}
        </Row>
        <Row className="calc-row" id="calc-row-4">
          {this.state.buttons.filter( (btn, index) => index >= 11 && index < 15).map( (btn, index) =>
            <CalcButton 
              name={btn.display}
              id={btn.id}
              key={btn.id}
              userInput={this.handleUserInput}
            />
          )}
        </Row>
        <Row className="calc-row" id="calc-row-5">
          {this.state.buttons.filter( (btn, index) => index >= 15 && 17).map( (btn, index) =>
            <CalcButton 
              name={btn.display}
              id={btn.id}
              key={btn.id}
              userInput={this.handleUserInput}
            />
          )}
        </Row>
      </Container>
    );
  }
}

export default App;
