import { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import CaptureCodebarView from './Components/CaptureCodebarView';
import CapturePhotoView from './Components/CapturePhotoView';
import bg from "./assets/images/bg.jpeg";
import EquipmentInformationView from './Components/EquipmentInformationView';
const TRANSITIONS = ['fade', 'slide', 'none'];
const STYLES = ['default', 'dark-content', 'light-content'];

export default function App() {
  const [view, setView] = useState<number>(1);
  const [currentCodebar, setCurrentCodebar] = useState<string>("201704250543");

  const gotoSearchEquipment = (props: any) => {
    setCurrentCodebar(props);
    console.log('searching', props);
    setView(2);
  }

  const gotoCapturePhoto = (props: any) => {
    setView(3);
  }

  const gotoInit = (props: any) => {
    setView(1)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#1b1c27"
        barStyle={"light-content"}/>
        <ImageBackground source={bg} style={styles.backgroundStyle}>
          { view == 1 && <CaptureCodebarView gotoNext={gotoSearchEquipment} codebar={currentCodebar}/> }
          { view == 2 && <EquipmentInformationView gotoNext={gotoCapturePhoto} codebar={currentCodebar}/> }
          { view == 3 && <CapturePhotoView gotoInit={gotoInit} codebar={currentCodebar}/> }
        </ImageBackground>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  backgroundStyle: {
    flex: 1,
    resizeMode: 'cover'
  }
});