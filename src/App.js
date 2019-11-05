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
    currentDisplay: "0",
    equation: []
  };

  currInputIndex =  0;
  currDecimals = 0;

  handleClearDisplay = () => {
    this.setState({currentDisplay: "0"});
    this.setState({equation: []});
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
    this.buildEquationPart('=');
    console.log("PLACEHOLDER FOR EQUALS");
  }

  buildEquationPart = (userInput) => {
    console.log("INDEX: ", this.currInputIndex);
    if (this.state.equation.length === 0) {
      const newOperand = parseFloat(this.state.currentDisplay);
      const newOperation = userInput;
      let newEquationPiece = {
        operand: newOperand,
        operator: newOperation
      }
      const newEquationState = [newEquationPiece];
      this.setState({equation: newEquationState});
      this.currInputIndex++;
    } else {
      const lastOperation = this.state.equation[this.currInputIndex-1].operator;
      const lastOperationIndex = this.state.currentDisplay.lastIndexOf(lastOperation);
      const newOperand = parseFloat(this.state.currentDisplay.slice(lastOperationIndex+1));
      const newOperation = userInput;
      if (isNaN(newOperand)) {
        // Ignores new equation part if there is no valid operand
        console.log("OPERAND IS NOT A VALID NUMBER: ", newOperand);
        let prevEquationState = this.state.equation.slice();
        this.setState({equation: prevEquationState});
      } else {
        let newEquationPiece = {
          operand: newOperand,
          operator: newOperation
        }
        let prevEquationState = this.state.equation.slice();
        prevEquationState.push(newEquationPiece);
        this.setState({equation: prevEquationState});
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
    }
    else if (prevInput.length === 1 && prevInput === "0" && OPERATIONS.includes(newInput)) {
      //Doesn't allow first user input to be an operator
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
        this.currDecimals++;
          if (this.currDecimals > 1) {
            newInput = "";
          }
      }
      const newDisplay = prevInput.concat('', newInput);
      this.setState({currentDisplay: newDisplay});
    }
  }

  handleUserInput = (evt) => {
    const targetId = evt.target.id;
    let targetContent = evt.target.firstChild.nodeValue;
    console.log("CURRENT DISPLAY: ", this.state.currentDisplay);
    console.log("NEW INPUT: ", targetContent);
    if (targetId === "backspace" || targetId === "clear" || targetId === "equals") {
      if (targetId === "clear") {
        this.handleClearDisplay();
      } else if (targetId === "backspace") {
        this.handleBackspace();
      } else if (targetId === "equals") {
        
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
      this.buildEquationPart(targetContent);
      this.concatUserInput(targetContent);
    } else {
      this.concatUserInput(targetContent);
    } 
  }

  render() {
    console.log(this.state.equation);
    console.log(this.state.currentDisplay);
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
