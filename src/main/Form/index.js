import React from 'react';

import ReactSelect from 'react-select';

const options = [
  {value: 'san_francisco', label: 'San Francisco'},
  {value: 'san_jose', label: 'San Jose'},
  {value: 'oakland', label: 'Oakland'},
];

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: this.props.userInfo.city,
    }
  }

  _onSubmit(e) {
    e.preventDefault();
  }

  _updateData(val) {
    if (val.city) {
      this.setState(val);
    }
    this.props.updateUser({
      first_name: this.refs.firstName.value,
      last_name: this.refs.lastName.value,
      phone_number: this.refs.phoneNumber.value,
      city: val.city || this.state.city || null,
    });
  }

  render() {
    let selectClassName = 'shopper__box-select';
    if (!this.state.city) {
      selectClassName = selectClassName + ' shopper__box-select-invalid';
    }

    return (
      <form className="shopper__box-form" onSubmit={this._onSubmit.bind(this)} ref='userForm'>
        <input
          placeholder="First Name"
          defaultValue={this.props.userInfo.first_name}
          onChange={val => this._updateData({first_name: val})}
          ref="firstName"
          required
        />
        <input
          placeholder="Last Name"
          defaultValue={this.props.userInfo.last_name}
          onChange={val => this._updateData({last_name: val})}
          ref="lastName"
          required
        />
        <input
          placeholder="Phone"
          defaultValue={this.props.userInfo.phone_number}
          onChange={val => this._updateData({phone_number: val})}
          pattern="^[0-9\(\)-]{9,15}$"
          type="number"
          ref="phoneNumber"
          required
        />
        <ReactSelect
          className="shopper__box-select"
          onChange={val => this._updateData({city: val})}
          options={options}
          value={this.state.city}
          required
        />
      </form>
    );
  }
}
