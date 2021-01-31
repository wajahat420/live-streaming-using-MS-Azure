import React, { Component } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import Video from "react-native-video";
// const randomId = require("random-id");

import CommentList from "../components/CommentList";

export default class ViewStream extends Component {

  static navigationOptions = {
    header: null
  };


  state = {
    text: '',
    isInputContainerVisible: false,
    comments: []
  }

  constructor(props) {
    super(props);
    // const { navigation } = this.props;
    // this.stream_id = navigation.getParam('stream_id');
    // this.mux_playback_id = navigation.getParam('mux_playback_id');
    // this.stream_channel = navigation.getParam('stream_channel');

    this.stream_id = "mjTwU9Xp900HAXH5fLHeiHHLkFxosBQJ7V3mMn00vAtb8";
    this.mux_playback_id = "w02ydfYWHLVRsjvMgB7vEa42zhVYVP01zUXWtDY9jvCJc";
    this.stream_channel = "";
  
  }


  componentDidMount() {
    // this.stream_channel.bind('client-viewer-comment', async (comment) => {
    //   await this.setState((prevState) => ({
    //     comments: prevState.comments.concat(comment)
    //   }));
    // });
  }


  render() {
    const { isInputContainerVisible, text, comments } = this.state;
    // https://stream.mux.com/TxIx4vDvNukOEPTsl4IP4j4to4z7MOMJkEHjBcrxo00c.m3u8
    // http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4
    return (
      <View style={styles.container}>
        <Text style={{textAlign : "center", fontSize : 20,fontWeight:"bold",top:20}}>Video</Text>
        <Video
          // source={{ uri: `https://stream.mux.com/H9Alx901r13l99ksaYUbMY1HfJmCOS01X4IUQSBE6Zncc.m3u8` }}
          source={{ uri: `https://123com.blob.core.windows.net/asset-940a908f-1ced-4346-94d3-08b2584c9be5/video_1350000/10181880.mp4` }}
          ref={ref => {
            this.player = ref;
          }}
          onError={this.onVideoError}  
          onEnd={this.onVideoEnd}
          style={styles.videoStream}
          controls={true}
          resizeMode={"cover"}
        />

        <CommentList comments={comments} />

        {
          isInputContainerVisible &&
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type here to translate!"
              onChangeText={(text) => this.setState({text})}
              onSubmitEditing={this._sendComment}
              value={text}
            />
          </View>
        }

        <TouchableOpacity style={styles.buttonContainer} onPress={() => {
          this.setState(prevState => ({
            isInputContainerVisible: !prevState.isInputContainerVisible
          }));
        }}>
          <View>
            <Text style={styles.typeText}>{ isInputContainerVisible ? 'Close' : 'Type something..' }</Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }

  onVideoError = () => {
    Alert.alert('Error occurred', 'Something went wrong while loading the video');
    // this.props.navigation.navigate("Index");
  }

  onVideoEnd = () => {
    Alert.alert('Stream ended', 'The stream ended');
    // this.props.navigation.navigate("Index");
  }

  _sendComment = () => {
    // const id = randomId(10);
    const { text } = this.state;
    // this.stream_channel.trigger('client-viewer-comment', {
    //   id,
    //   text
    // });

    // this.setState((prevState) => ({
    //   comments: prevState.comments.concat({ id, text }),
    //   text: '',
    //   isInputContainerVisible: false
    // }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height :  "100%"
  },
  videoStream: {
    position: 'absolute',
    top: 50,
    left: 0,
    bottom: 0,
    right: 0,
    height : "100%"
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  textInput: {
    height: 40,
    backgroundColor: '#FFF'
  },
  typeText: {
    color: '#FFF'
  }
});