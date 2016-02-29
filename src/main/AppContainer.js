import React from 'react';
import Request from 'superagent';

import Apply from './Apply';
import BackgroundCheck from './BackgroundCheck';
import Button from './Button';
import Complete from './Complete';
import ErrorScreen from './ErrorScreen';
import Footer from './Footer';
import Form from './Form';
import Header from './Header';
import Spinner from './Spinner';

const STAGE_MAX = 3;
const STAGE_MIN = 0;

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      loading: false,
      userInfo: this.props.data || {},
      backgroundCheck: null,
      complete: false,
      error: false,
    }
  }

  _updateBackgroundCheck(e) {
    this.setState({
      backgroundCheck: e
    });
  }

  // Send date is not reliant on server response to continue through the app
  _sendData() {
    let payload = {};
    payload.user = this.state.userInfo;
    if (this.state.backgroundCheck === 'yes') {
      payload.user.background_check = true;
    } else if (this.state.backgroundCheck === 'no') {
      payload.user.background_check = false;
    }
    payload.user.complete = this.state.complete;
    if (this.state.userInfo.phone_number && typeof this.state.userInfo.phone_number === 'number') {
      payload.user.phone_number = JSON.stringify(this.state.userInfo.phone_number)
    }
    console.log('payload looks like...', payload);
    Request
      .post('/applicants')
      .send(payload)
      .end(function(err, res) {
        if (err) {
          console.error(err);
          return this.setState({
            error: true,
          });
        }
      });
  }

  // The initial apply process requires server response to proceed.
  _onApply() {
    let setState = this.setState.bind(this);
    this.setState({
      loading: true,
    });
    let payload = {};
    payload.user = {
      email: this.state.userInfo.email,
    }
    Request
      .post('/applicants')
      .send(payload)
      .end(function(err, res) {
        if (err) {
          console.error(err);
          return setState({
            error: true,
          });
        }

        setState(state => ({
          stage: Math.min(STAGE_MAX, state.stage + 1),
          loading: false,
          userInfo: res.body.user || {},
          complete: res.body.user.complete || false,
        }))
      });
  }

  _nextStage(e) {
    if (this._isValid()) {
      this.setState(state => ({
        loading: false,
        stage: Math.min(STAGE_MAX, state.stage + 1),
        complete: state.stage === 2 ? true : false
      }), this._sendData);
    }
  }

  _prevStage() {
    this.setState(state => ({stage: Math.max(STAGE_MIN, state.stage - 1)}))
  }

  _updateUser(newData) {
    this.setState(({userInfo}) => ({userInfo: Object.assign(userInfo, newData)}) )
  }

  _isValid() {
    if (this.state.stage === 1) {
      let check = this.refs.formRef.refs.userForm;
      // Todo(Warren): Feels hacky, find a better way to validate
      return this.refs.formRef.refs.userForm.checkValidity() && this.state.userInfo.city;
    } else if (this.state.stage === 2) {
      return this.state.backgroundCheck ? true : false;
    } else {
      return true;
    }
  }

  render() {
    let comp;
    let hideNav = false;
    if (this.state.loading) {
      comp = <Spinner />
      hideNav = true;
    } else if (this.state.complete) {
      comp = <Complete />;
      hideNav = true;
    } else if (this.state.error) {
      comp = <ErrorScreen />
      hideNav = true;
    } else {
      switch(this.state.stage) {
        case 0:
          comp = (
            <Apply
              userInfo={this.state.userInfo}
              updateUser={this._updateUser.bind(this)}
              onApply={this._onApply.bind(this)}
            />
          );
          hideNav = true;
          break;
        case 1:
          comp = (
            <Form
              userInfo={this.state.userInfo}
              nextStage={this._nextStage.bind(this)}
              prevStage={this._prevStage.bind(this)}
              updateUser={this._updateUser.bind(this)}
              ref='formRef'
            />
          );
          break;
        case 2:
          comp = (
            <BackgroundCheck 
              nextStage={this._nextStage.bind(this)}
              prevStage={this._prevStage.bind(this)}
              updateData={this._updateBackgroundCheck.bind(this)}
            />
          );
          break;
        case 3:
          comp = <Complete />;
          hideNav = true;
          break;
      }
    }


    return (
      <div className="shopper__container">
        <div className="shopper__box">
          <Header />
            <div className="shopper__box-content">
              <Button
                onClick={this._prevStage.bind(this)}
                prev={true}
                hidden={hideNav}
                disabled={this.state.loading}
              />
              <Button
                onClick={this._nextStage.bind(this)}
                prev={false}
                hidden={hideNav}
                disabled={this.state.loading}
              />
              {comp}
            </div>
          <Footer stages={STAGE_MAX} />
        </div>
      </div>
    );
  }
}
