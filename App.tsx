import { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import CaptureCodebarView from './Components/CaptureCodebarView';
import CapturePhotoView from './Components/CapturePhotoView';
const TRANSITIONS = ['fade', 'slide', 'none'];
const STYLES = ['default', 'dark-content', 'light-content'];

export default function App() {
  const [view, setView] = useState<number>(2);
  const currentCode = "10650149";

  const gotoCapturePhoto = (props: any) => {
    console.log(props);
    setView(2);
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
      { view == 1 && <CaptureCodebarView gotoNext={gotoCapturePhoto}/> }
      { view == 2 && <CapturePhotoView gotoInit={gotoInit} codebar={currentCode}/> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1b1c27'
  }
});