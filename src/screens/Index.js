import React, { Component } from "react";
import { View, Text, Button, Clipboard, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
import axios from "axios";
// import Config from "react-native-config";
import Permissions from "react-native-permissions";
import Publish from "./video"
import ViewStream from "./ViewStream"
// import Pusher from "pusher-js/react-native";

const generateRandomAnimalName = require('random-animal-name-generator');
const MUX_TOKEN_ID= "4e5e78f4-3ef5-4239-b016-bacc6fae7467"
const MUX_TOKEN_SECRET="VRijGmmJOtUb4gB4PMUqD0vmWVFuyZQUteNnwIwIgjJ8AL4dMiiQYtp7dGxpyfvrvdDmRrx6UEs"

const SERVER_BASE_URL = 'http://192.168.1.120:8000';

const mux_instance = axios.create({
  baseURL: 'https://api.mux.com',
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  auth: {
    username: MUX_TOKEN_ID,
    password: MUX_TOKEN_SECRET
  }
})
// .then(res=> console.log("resTop",res))
// .catch(err => console.log("errTop",err))

export default class Index extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(){
    super()
    this.stream_id = "";
    this.stream_channel = "";
  }

  state = {
    showStreamIDInputDialog: false,
    showStreamIDDialog: false,
    streamIDToView: "",
    generatedStreamID: generateRandomAnimalName().replace(' ', '-').toLocaleLowerCase() + '-' + Math.floor(Math.random() * 100),
    stream_key : "",
    playback_id : "",
    navigate : "publish"
  }

  async componentDidMount(){
    console.log("axios")

    // axios.get("http://192.168.0.113:5050/video/livePaths")
    // .then(res=>{
    //   console.log(res.data)
    //   this.setState({playback_id : res.data})

    // })
    // .catch(err=>console.log(err))

    // axios.get("http://192.168.0.113:5050/video/startLiveStream")
    // .then(res=>{
    //   console.log(res.data)
    //   this.setState({stream_key : res.data})

    // })
    // .catch(err=>console.log(err))


    // axios({
    //   method: 'post',
    //   url: '/startLiveStream',
    //   data: data
    // })

  }

  render() {
    const { showStreamIDInputDialog, showStreamIDDialog ,generatedStreamID, stream_key, playback_id } = this.state;

    let navigateTo = 
    <View style={styles.wrapper}>
    <Text style={styles.label}>What do you want to do?</Text>

    <View style={styles.buttonContainer}>
      <Button title="Publish Stream" color="#0064e1" onPress={() => this.setState({showStreamIDDialog: true})} />
    </View>
    <View style={styles.buttonContainer}>
      <Button title="View Stream" color="#6f42c1" onPress={() => this.setState({ showStreamIDInputDialog: true })} />
    </View>


    <Dialog.Container visible={showStreamIDInputDialog}>
      <Dialog.Title>Enter the Stream ID</Dialog.Title>
      <Dialog.Input label="Stream ID" placeholder="eg. XYZ-123" onChangeText={(text) => this.setState({ streamIDToView: text })}></Dialog.Input>
      <Dialog.Button label="Cancel" onPress={() => this.setState({ showStreamIDInputDialog: false })} />
      <Dialog.Button label="Go" onPress={this._goToView} />
    </Dialog.Container>

    <Dialog.Container visible={showStreamIDDialog}>
      <Dialog.Title>Here's your Stream ID</Dialog.Title>
      <Dialog.Description>
      {generatedStreamID}
      </Dialog.Description>

      <Dialog.Button label="Cancel" onPress={() => this.setState({ showStreamIDDialog: false })} />
      <Dialog.Button label="Copy and Go" onPress={this._goToPublish} />
    </Dialog.Container>

  </View>
    
    if(this.state.navigate === "publish"){
      navigateTo = 
      <Publish
        stream_key = {stream_key}
        navigateTO = {()=>this.setState({navigate : "view"})}
      />
    }else if(this.state.navigate === "view"){
      navigateTo = 
      <ViewStream
        playback_id = {playback_id}
      />
    }

    return (
      <>
        {navigateTo}
      </>
    );
  }


  _goToPublish = async () => {
    const { generatedStreamID } = this.state;

    // Clipboard.setString(generatedStreamID);



    // const server_response = await axios.post(`${SERVER_BASE_URL}/stream`, {
    //   id: generatedStreamID,
    //   mux_stream_key,
    //   mux_playback_id
    // });
    // this.stream_key = mux_stream_key
    // this.playback_id = mux_playback_id

    this.setState({
      showStreamIDDialog: false,
      navigate : "publish",
      mux_stream_key,
      mux_playback_id
    });

  }


  _goToView = async () => {
    const { streamIDToView } = this.state;

    this.setState({
      showStreamIDInputDialog: false
    });

    // try {
      // const { data } = await axios.get(`${SERVER_BASE_URL}/stream/${streamIDToView}`);
      // this.stream_channel = this.pusher.subscribe(`private-stream-${streamIDToView}`);

      // this.props.navigation.navigate("ViewStream", {
      //   stream_id: streamIDToView,
      //   mux_playback_id: data.playback_id,
      //   stream_channel: this.stream_channel
      // });
    // } catch (err) {
    //   console.log("error retrieving livestream: ", err);
    // }
  }
  _togglePublish = () => {
    if (this.state.isPublishing) {
      this.setState({ publishButtonText: 'Start Publishing', isPublishing: false });
      this.vb.stop();

      Alert.alert(
        'Stream finished!',
        'Thanks for using the app'
      );

      this.props.navigation.navigate('Index');

    } else {
      this.setState({ publishButtonText: 'Stop Publishing', isPublishing: true });
      this.vb.start();
    }
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  buttonContainer: {
    margin: 10
  },


});