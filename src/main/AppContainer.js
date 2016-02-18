import React from 'react';
import Request from 'superagent';

import Apply from './Apply';
import BackgroundCheck from './BackgroundCheck';
import Button from './Button';
import Complete from './Complete';
import Footer from './Footer';
import Form from './Form';
import Header from './Header';
import Spinner from './Spinner';

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      loading: false,
      userInfo: this.props.data,
      backgroundCheck: null,
      complete: false,
    }
  }

  _nextStage(e) {
    if (this._isValid()) {
      this.setState(state => ({
        stage: Math.min(3, state.stage + 1)
      }));
    }
  }

  _updateBackgroundCheck(e) {
    this.setState({
      backgroundCheck: e
    });
  }

  _prevStage() {
    this.setState(state => ({stage: Math.max(0, state.stage - 1)}))
  }

  _updateUser(newData) {
    console.log('new data!', newData);
    this.setState(({userInfo}) => ({userInfo: Object.assign(userInfo, newData)}) )
  }

  _isValid() {
    if (this.state.stage === 1) {
      let check = this.refs.formRef.refs.userForm;
      console.log('validity check: ', check);
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
    } else {
      switch(this.state.stage) {
        case 0:
          comp = (
            <Apply
              userInfo={this.state.userInfo}
              updateUser={this._updateUser.bind(this)}
              onApply={this._nextStage.bind(this)}
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
          <Footer />
        </div>
      </div>
    );
  }
}
