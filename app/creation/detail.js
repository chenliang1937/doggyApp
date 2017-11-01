import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
  AlertIOS
} from "react-native";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import request from "../common/request";
import config from "../common/config";
import Button from "react-native-button";

const width = Dimensions.get("window").width;

export default class Account extends Component {
  constructor(props) {
    super(props);
    let item = this.props.item;

    this.state = {
      item: item,
      rate: 1,
      muted: false,
      resizeMode: "contain",
      repeat: false,

      videoLoaded: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      playing: false,
      paused: false,
      videoOk: true,

      comments: [],

      animationType: "none",
      modalVisiable: false,
      isSending: false,
      content: ""
    };
  }

  _onLoadStart() {}

  _onLoad() {}

  _onProgress(data) {
    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      });
    }

    let duration = data.playableDuration;
    let currentTime = data.currentTime;
    let percent = Number((currentTime / duration).toFixed(2));

    this.setState({
      playing: true,
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    });
  }

  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    });
  }

  _onError(e) {
    this.setState({
      videoOk: false
    });
  }

  _rePlay() {
    this.refs.videoPlayer.seek(0);
  }

  _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      });
    }
  }

  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false
      });
    }
  }

  componentDidMount() {
    this._fetchComment();
  }

  _fetchComment() {
    request
      .get(config.api.base + config.api.comment, {
        creation: "123",
        accessToken: "1"
      })
      .then(data => {
        if (data && data.success) {
          let comments = data.data;
          if (comments && comments.length > 0) {
            this.setState({
              comments: comments
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  _renderItem = ({ item }) => (
    <View key={item._id} style={styles.replyBox}>
      <Image style={styles.replyAvatar} source={{ uri: item.replyBy.avatar }} />
      <View style={styles.reply}>
        <Text style={styles.replyNickname}>{item.replyBy.nickname}</Text>
        <Text style={styles.replyContent}>{item.content}</Text>
      </View>
    </View>
  );

  _keyExtractor = (item, index) => item._id;

  _focus() {
    this._setModalVisiable(true);
  }

  _blur() {}

  _closeModal() {
    this._setModalVisiable(false);
  }

  _setModalVisiable(isVisiable) {
    this.setState({
      modalVisiable: isVisiable
    });
  }

  _submit() {
    if (!this.state.content) {
      return AlertIOS.alert("留言不能为空");
    }

    if (this.state.isSending) {
      return AlertIOS.alert("正在评论中");
    }

    this.setState(
      {
        isSending: true
      },
      () => {
        let body = {
          accessToken: "abc",
          creation: "123",
          content: this.state.content
        };

        let url = config.api.base + config.api.comment;
        request
          .post(url, body)
          .then(data => {
            if (data && data.success) {
              let items = [
                {
                  _id: "1",
                  content: this.state.content,
                  replyBy: {
                    avatar: "http://dummyimage.com/640x640/5e803e",
                    nickname: "二狗子二狗子"
                  }
                }
              ];
              let theData = this.state.comments;
              this.setState({
                isSending: false,
                comments: items.concat(theData)
              });

              this._setModalVisiable(false);
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({
              isSending: false
            });
            this._setModalVisiable(false);
            AlertIOS.alert("留言失败，稍后重试");
          });
      }
    );
  }

  render() {
    let item = this.props.item;

    return (
      <View style={styles.container}>
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            source={{ uri: item.video }}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />

          {!this.state.videoOk && (
            <Text style={styles.failText}>视频出错了！很抱歉</Text>
          )}

          {!this.state.videoLoaded && (
            <ActivityIndicator color="#ee735c" style={styles.loading} />
          )}

          {this.state.videoLoaded && !this.state.playing ? (
            <Icon
              onPress={this._rePlay.bind(this)}
              name="ios-play"
              size={48}
              style={styles.playIcon}
            />
          ) : null}

          {this.state.videoLoaded && this.state.playing ? (
            <TouchableOpacity
              onPress={this._pause.bind(this)}
              style={styles.pauseBtn}
            >
              {this.state.paused ? (
                <Icon
                  onPress={this._resume.bind(this)}
                  name="ios-play"
                  size={48}
                  style={styles.resumeIcon}
                />
              ) : (
                <Text />
              )}
            </TouchableOpacity>
          ) : null}

          <View style={styles.progressBox}>
            <View
              style={[
                styles.progressBar,
                { width: width * this.state.videoProgress }
              ]}
            />
          </View>
        </View>

        <FlatList
          style={styles.flatList}
          data={this.state.comments}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.infoBox}>
                <Image
                  style={styles.avatar}
                  source={{ uri: item.author.avatar }}
                />
                <View style={styles.descBox}>
                  <Text style={styles.nickname}>{item.author.nickname}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </View>
              <View style={styles.commentBox}>
                <View style={styles.comment}>
                  <TextInput
                    placeholder="敢不敢评论一个"
                    style={styles.content}
                    multiline={true}
                    onFocus={this._focus.bind(this)}
                  />
                </View>
              </View>

              <View style={styles.commentArea}>
                <Text style={styles.commentTitle}>精彩评论</Text>
              </View>
            </View>
          }
        />

        <Modal
          animationType={"fade"}
          visible={this.state.modalVisiable}
          onRequestClose={() => {
            this._setModalVisiable(false).bind(this);
          }}
        >
          <View style={styles.modalContainer}>
            <Icon
              onPress={this._closeModal.bind(this)}
              name="ios-close-outline"
              style={styles.closeIcon}
            />

            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder="敢不敢评论一个"
                  style={styles.content}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={text => {
                    this.setState({
                      content: text
                    });
                  }}
                />
              </View>
            </View>

            <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>
              评论
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    marginTop: 64
  },
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: "#000"
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: "#000"
  },
  failText: {
    position: "absolute",
    left: 0,
    top: 90,
    width: width,
    textAlign: "center",
    backgroundColor: "transparent"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 80,
    width: width,
    alignSelf: "center",
    backgroundColor: "transparent"
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: "#ccc"
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: "#ff6600"
  },
  playIcon: {
    position: "absolute",
    top: 90,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    color: "#ed7b66"
  },
  pauseBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: 360
  },
  resumeIcon: {
    position: "absolute",
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    color: "#ed7b66"
  },
  infoBox: {
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: "#666"
  },
  replyBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickname: {
    color: "#666"
  },
  replyContent: {
    marginTop: 4,
    color: "#666"
  },
  reply: {
    flex: 1
  },
  flatList: {
    marginBottom: 48
  },
  listHeader: {
    width: width,
    marginTop: 10
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  content: {
    paddingLeft: 2,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "#fff"
  },
  closeIcon: {
    alignSelf: "center",
    fontSize: 30,
    color: "#ee753c"
  },
  submitBtn: {
    position: "absolute",
    alignSelf: "center",
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ee735c",
    borderRadius: 4,
    color: "#ee753c",
    fontSize: 18
  }
});
