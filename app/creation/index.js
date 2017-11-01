import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  FlatList,
  TouchableHighlight,
  ImageBackground,
  Dimensions,
  AlertIOS
} from "react-native";
import request from "../common/request";
import config from "../common/config";
import Icon from "react-native-vector-icons/Ionicons";
import Detail from './detail'

const width = Dimensions.get("window").width;
let theData = [];

class Item extends Component {
  constructor(props) {
    super(props);
    let item = this.props.item;
    this.state = {
      up: item.voted,
      item: item
    };
  }

  _up() {
    let up = !this.state.up;
    let item = this.state.item;
    let url = config.api.base + config.api.up;

    let body = {
      id: item._id,
      up: up ? "yes" : "no",
      accessToken: "1"
    };

    request
      .post(url, body)
      .then(data => {
        if (data && data.success) {
          this.setState({
            up: up
          });
        } else {
          AlertIOS.alert("点赞失败");
        }
      })
      .catch(err => {
        AlertIOS.alert(err);
      });
  }

  render() {
    let item = this.state.item;
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <ImageBackground source={{ uri: item.thumb }} style={styles.thumb}>
            <Icon name="ios-play" size={28} style={styles.play} />
          </ImageBackground>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name={this.state.up ? "ios-heart" : "ios-heart-outline"}
                size={28}
                style={[styles.up, this.state.up ? null : styles.down]}
                onPress={this._up.bind(this)}
              />
              <Text style={styles.handleText} onPress={this._up.bind(this)}>
                喜欢
              </Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon}
              />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      refreshing: false
    };
  }

  _keyExtractor = (item, index) => item._id;

  componentDidMount() {
    this._fetchData();
  }

  getData(flag) {
    if (flag) {
      this.setState({ refreshing: true });
    }
    request
      .get(config.api.base + config.api.creation, { accessToken: "2" })
      .then(data => {
        if (flag) {
          this.setState({ refreshing: false });
        }
        if (data.success) {
          if (flag) {
            this.setState({
              dataSource: data.data
            });
            theData = data.data;
          } else {
            theData = theData.concat(data.data);
            this.setState({
              dataSource: theData
            });
          }
        } else {
          console.error("返回数据出错");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  _fetchData() {
    this.getData(true);
  }

  _fetchMoreData() {
    this.getData(false);
  }

  _renderItem = ({ item }) => (
    <Item key={item._id} onSelect={() => this._loadPage(item)} item={item} />
  );

  _loadPage(item) {
    this.props.navigator.push({
      component: Detail,
      title: "详情页",
      passProps: {
        item: item
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this._fetchData.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={0.1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600"
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  thumb: {
    width: width,
    height: width * 0.56
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: "#333"
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee"
  },
  handleBox: {
    padding: 10,
    flexDirection: "row",
    width: width / 2 - 0.5,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  handleText: {
    justifyContent: "center",
    marginLeft: 5,
    marginTop: 3
  },
  play: {
    position: "absolute",
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 23,
    color: "#ed7b66"
  },
  handlerText: {
    paddingLeft: 12,
    fontSize: 18,
    color: "#333"
  },
  down: {
    fontSize: 22,
    color: "#333"
  },
  up: {
    fontSize: 22,
    color: "#ed7b66"
  },
  commentIcon: {
    fontSize: 22,
    color: "#333"
  }
});
