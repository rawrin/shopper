import React from 'react';

export default class Apply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.userInfo.email || null,
      valid: true,
    }
  }

  _onClick() {
    if (!this.state.email || !this.refs.email.checkValidity()) {
      this.setState({
        valid: false,
      });
    } else {
      this.props.onApply();
    }
  }

  _updateData(val) {
    this.setState(val);
    this.props.updateUser({
      email: this.refs.email.value
    });
  }

  render() {
    let className = 'shopper__box-apply-input';
    if (!this.state.valid) {
      className += ' shopper__box-apply-input-invalid';
    }

    return (
      <div className="shopper__box-apply">
        <h1>Work at Instacart</h1>
        <p>Earn up to $20 an hour shopping or delivering groceries at Instacart!</p>

        <input
          className={className}
          defaultValue={this.state.email}
          onChange={val => this._updateData({email: val})}
          placeholder="Email"
          ref="email"
          required
          type="email"
        />
        <button onClick={this._onClick.bind(this)}>Apply Now!</button>
      </div>
    );
  }
}