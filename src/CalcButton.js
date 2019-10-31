import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

class CalcButton extends Component {

  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    id: PropTypes.string.isRequired,
    userInput: PropTypes.func
  };

  render() {
    const {
      name,
      id,
      userInput
    } = this.props;
    return (
      <Button onClick={userInput} type="button" className="btn calc-btn" variant="outline-light" id={id}>
        {name}
      </Button>
    );
  };
}

export default CalcButton;