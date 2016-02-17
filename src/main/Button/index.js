import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    }
  }

  render() {
    let state = 'next';
    if (this.props.prev) {
      state = 'prev';
    }
    let className = 'shopper__button shopper__button-' + state;
    if (this.props.hidden) {
      className = className + ' shopper__button-hidden';
    }
    return (
      <div className={className} onClick={this.props.onClick} />
    );
  }
}
