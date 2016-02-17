import React from 'react';

export default class BackgroundCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    }
  }

  _onChange(e) {
    this.props.updateData(e.target.value);
    this.setState({
      value: e.currentTarget.value
    });
  }

  render() {
    let consentString = 'Please select an option before continuing.';
    let consentClass = 'shopper__bc-consent';
    if (this.state.value === 'yes') {
      consentString = 'Yes, I give my consent to perform a background check.';
      consentClass += ' shopper__bc-consented';
    } else if (this.state.value === 'no') {
      consentString = 'No, I do not give my consent to perform a background check.';
      consentClass += ' shopper__bc-consented';
    }

    return (
      <form className="shopper__bc">
        <p className="shopper__bc-text">Before we wrap up registration, we have a standardized background check we would like to perform.</p>
        <p className={consentClass}>{consentString}</p>
        <input id="shopper__bc-no" name="bc" type="radio" value="no" onChange={this._onChange.bind(this)} checked={this.state.value === "no"}/> 
        <label className="shopper__bc-input" htmlFor="shopper__bc-no">No</label>
        <input id="shopper__bc-yes" name="bc" type="radio" value="yes" onChange={this._onChange.bind(this)} checked={this.state.value === "yes"}/> 
        <label htmlFor="shopper-bc-yes">Yes</label>
      </form>
    );
  }
}
