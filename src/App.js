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
    currentInput: "0"
  };

  handleClearDisplay = () => {
    this.setState({currentInput: "0"});
  }

  handleBackspace = () => {
    let backOne = this.state.currentInput.slice(0, -1);
    if (backOne.length < 1) {
      backOne = "0";
    }
    this.setState({currentInput: backOne});
  }

  concatUserInput = (inpt) => {
    const prevInput = this.state.currentInput.toString();
    let newInput = inpt.toString();
    if (prevInput.length === 1 && prevInput === "0" && newInput === "0") {
      this.setState({currentInput: "0"});
    } else if (prevInput.length === 1 && prevInput === "0" && newInput !== "0") {
      this.setState({currentInput: newInput});
    } else {
      const newDisplay = prevInput.concat('', newInput);
      this.setState({currentInput: newDisplay});
    }
  }

  handleUserInput = (evt) => {
    const targetId = evt.target.id;
    let targetContent = evt.target.firstChild.nodeValue;
    if (targetId === "backspace" || targetId === "clear" || targetId === "equals") {
      console.log("PLACEHOLDER");
      if (targetId === "clear") {
        this.handleClearDisplay();
      } else if (targetId === "backspace") {
        this.handleBackspace();
      }
    } else if (targetContent === "0" || targetContent === 0) {
      if (OPERATIONS.includes(this.state.currentInput.slice(-1))) {
        while (targetContent.length > 1 && targetContent[0] === "0") {
          targetContent = targetContent.slice(1);
        }
      }
      this.concatUserInput(targetContent);
    } else {
      this.concatUserInput(targetContent);
    } 
  }

  render() {
    return (
      <Container id="calculator">
        <Display 
          userInput={this.state.currentInput}
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
