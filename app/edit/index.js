import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TabBarIOS } from "react-native";

export default class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>制作视频</Text>
      </View>
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
