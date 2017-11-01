/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS,
  AsyncStorage
} from "react-native";

import List from "./app/creation/index";
import Edit from "./app/edit/index";
import Account from "./app/account/index";
import Login from "./app/account/login";

import Icon from "react-native-vector-icons/Ionicons";

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      selectedTab: "list",
      presses: 0,
      notifCount: 0,
      logined: false
    };
  }

  componentDidMount() {
    this._asyncAppStatus();
  }

  _asyncAppStatus() {
    AsyncStorage.getItem("user").then(data => {
      let user;
      let newState = {};

      if (data) {
        user = JSON.parse(data);
      }

      if (user && user.accessToken) {
        newState.user = user;
        newState.logined = true;
      } else {
        newState.logined = false;
      }

      this.setState(newState);
    });
  }

  _afterLogin(user) {
    let userStr = JSON.stringify(user)
    AsyncStorage.setItem('user', userStr)
      .then(() => {
        this.setState({
          logined: true,
          user: userStr
        })
      })
  }

  render() {
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin.bind(this)}/>;
    }

    return (
      <TabBarIOS
        unselectedTintColor="black"
        tintColor="green"
        barTintColor="#F5FCFF"
      >
        <Icon.TabBarItem
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          title="List"
          selected={this.state.selectedTab === "list"}
          onPress={() => {
            this.setState({
              selectedTab: "list"
            });
          }}
        >
          <NavigatorIOS
            initialRoute={{
              component: List,
              title: "列表页面"
            }}
            style={{ flex: 1 }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          title="Video"
          selected={this.state.selectedTab === "edit"}
          onPress={() => {
            this.setState({
              selectedTab: "edit",
              notifCount: this.state.notifCount + 1
            });
          }}
        >
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          renderAsOriginal
          title="More"
          selected={this.state.selectedTab === "account"}
          onPress={() => {
            this.setState({
              selectedTab: "account",
              presses: this.state.presses + 1
            });
          }}
        >
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: "center"
  },
  tabText: {
    color: "white",
    margin: 50
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
