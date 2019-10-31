import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Display extends Component {
  static propTypes = {
    userInput: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };

  render() {
    const {
      userInput
    } = this.props;
    return (
      <div className="text-right" id="display">
        {userInput}
      </div>
    );
  }
}

export default Display;