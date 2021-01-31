import Publish from "./src/screens/Index"
import Video from "./video/video"
// import Bambuser from "./Bambuser/bambuser"

import React from 'react';

import {StatusBar} from 'react-native';


const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Publish/>
    {/* <Video/> */}
    {/* <Bambuser/> */}
    </>
  );
};

export default App;
