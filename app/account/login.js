import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS
} from "react-native";
import Button from "react-native-button";
import request from "../common/request";
import config from "../common/config";
import CountDown from "../common/CountDownButton";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      verifyCode: "",
      codeSent: false,
      countingDone: false
    };
  }

  _submit() {
    let phoneNumber = this.state.phoneNumber;
    let verifyCode = this.state.verifyCode;

    if (!phoneNumber || !verifyCode) {
      return AlertIOS.alert("手机号或者验证码不能为空");
    }

    let body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    };

    let verifyURL = config.api.base + config.api.verify;

    request
      .post(verifyURL, body)
      .then(data => {
        if (data && data.success) {
          this.props.afterLogin(data.data)
        } else {
          AlertIOS.alert("获取验证码失败，请检查手机号是否正确");
        }
      })
      .catch(err => {
        AlertIOS.alert("获取验证码失败，请检查网络是否良好");
      });
  }

  _countingDone() {
    this.setState({
      countingDone: true
    });
  }

  _showVerifyCode() {
    this.setState({
      codeSent: true
    });
  }

  _sendVerifyCode() {
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      return AlertIOS.alert("手机号不能为空!");
    }

    let body = {
      phoneNumber: phoneNumber
    };
    let signURL = config.api.base + config.api.signup;

    request
      .post(signURL, body)
      .then(data => {
        if (data && data.success) {
          this._showVerifyCode();
        } else {
          AlertIOS.alert("获取验证码失败，请检查手机号是否正确");
        }
      })
      .catch(err => {
        AlertIOS.alert("获取验证码失败，请检查网络是否良好");
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <TextInput
            placeholder="输入手机号"
            autoCapitalize={"none"}
            autoCorrect={false}
            keyboardType={"number-pad"}
            style={styles.inputField}
            onChangeText={text => {
              this.setState({
                phoneNumber: text
              });
            }}
          />

          {this.state.codeSent ? (
            <View style={styles.verifyCodeBox}>
              <TextInput
                placeholder="输入验证码"
                autoCapitalize={"none"}
                autoCorrect={false}
                keyboardType={"number-pad"}
                style={styles.inputVerify}
                onChangeText={text => {
                  this.setState({
                    verifyCode: text
                  });
                }}
              />
              {this.state.countingDone ? (
                <Button
                  style={styles.countBtn}
                  onPress={this._sendVerifyCode.bind(this)}
                >
                  获取验证码
                </Button>
              ) : (
                <CountDown
                  id="register"
                  frameStyle={{ width: 150 }}
                  beginText="获取验证码"
                  endText="再次获取验证码"
                  count={60}
                  pressAction={() => {
                    this.countDownButton.startCountDown();
                  }}
                  changeWithCount={count => count + "s后重新获取"}
                  ref={e => {
                    this.countDownButton = e;
                  }}
                />
              )}
            </View>
          ) : null}

          {this.state.codeSent ? (
            <Button style={styles.btn} onPress={this._submit.bind(this)}>
              登陆
            </Button>
          ) : (
            <Button
              style={styles.btn}
              onPress={this._sendVerifyCode.bind(this)}
            >
              获取验证码
            </Button>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9"
  },
  signupBox: {
    marginTop: 30
  },
  inputField: {
    height: 40,
    padding: 5,
    color: "#666",
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 4
  },
  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    borderWidth: 1,
    borderRadius: 4,
    color: "#ee735c"
  },
  verifyCodeBox: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  countBtn: {
    flex: 1,
    height: 40,
    padding: 5,
    marginLeft: 8,
    backgroundColor: "transparent",
    borderColor: "#ee735c",
    textAlign: "left",
    fontSize: 15,
    borderRadius: 2
  },
  inputVerify: {
    flex: 2,
    height: 40,
    padding: 5,
    color: "#666",
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 4
  }
});
