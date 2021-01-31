import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Button,
  Alert
} from 'react-native';


import {NodeCameraView} from 'react-native-nodemediaclient';


const styles = StyleSheet.create({
  view: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 50,
    position: 'absolute',
    zIndex: 2,
    bottom: 50,
  },
  button: {
    width: 200,
    height: 40,
    backgroundColor: '#014484',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'system',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});


class App extends React.Component {
  vb = null;


  state = {
    isStreaming: false,
    isPublishing: false,
    publishButtonText: 'Start Publishing',
  };

  videoSettings = {
    preset: 12,
    bitrate: 400000,
    profile: 1,
    fps: 15,
    videoFrontMirror: false,
  };


  cameraSettings = {cameraId: 1, cameraFrontMirror: true};
  audioSettings = {bitrate: 32000, profile: 1, samplerate: 44100};
  channel = 'nodeskwela';

  get height() {
    return Dimensions.get('window').height;
  }


  get width() {
    return Dimensions.get('window').width;
  }


  toggleStream = async () => {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);


    if (this.state.isStreaming) {
      this.vb.stop();
    } else {
      this.vb.start();
    }
    this.setState({
      isStreaming: !this.state.isStreaming,
    });
  };


  render() {
    const {publishButtonText}  = this.state
    return (
      <>
        <StatusBar barStyle="light-content" />
        <Button
          onPress={()=>this.props.navigateTO()}
          title="View Stream"
        />
        <View style={styles.view}>
          <NodeCameraView
            style={{
              height: this.height,
              width: this.width,
              zIndex: 1,
              backgroundColor: '#000000',
            }}
            ref={vb => {
              this.vb = vb;
            }}
            // outputUrl={
            //   `rtmp://live.mux.com/app/36109526-664e-a203-dc0e-b60549629c20`
            // }
            outputUrl={
              `rtmp://global-live.mux.com:5222/app/${this.props.mux_stream_key}`
            }
            camera={this.cameraSettings}
            audio={this.audioSettings}
            video={this.videoSettings}
            autopreview={true}></NodeCameraView>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={this.toggleStream}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  {this.state.isStreaming
                    ? 'Stop Streaming'
                    : 'Start Streaming'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

}


export default App;
