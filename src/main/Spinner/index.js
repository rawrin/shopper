import React from 'react';

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var className = this.props.className + ' shopper__spinner'

    return (
      <div className={className} {...this.props}>
        <div className="shopper__spinner-1 shopper__spinner-child"></div>
        <div className="shopper__spinner-2 shopper__spinner-child"></div>
        <div className="shopper__spinner-3 shopper__spinner-child"></div>
        <div className="shopper__spinner-4 shopper__spinner-child"></div>
        <div className="shopper__spinner-5 shopper__spinner-child"></div>
        <div className="shopper__spinner-6 shopper__spinner-child"></div>
        <div className="shopper__spinner-7 shopper__spinner-child"></div>
        <div className="shopper__spinner-8 shopper__spinner-child"></div>
        <div className="shopper__spinner-9 shopper__spinner-child"></div>
        <div className="shopper__spinner-10 shopper__spinner-child"></div>
        <div className="shopper__spinner-11 shopper__spinner-child"></div>
        <div className="shopper__spinner-12 shopper__spinner-child"></div>
      </div>
    );
  }
}
