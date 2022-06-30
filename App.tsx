import { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import CaptureCodebarView from './Views/CaptureCodebarView';
import CapturePhotoView from './Views/CapturePhotoView';
import bg from "./assets/images/bg.jpeg";
import EquipmentInformationView from './Views/Equipment/EquipmentInformationView';
import CreateEquipmentView from './Views/CreateEquipmentView';
import useToggle from './hooks/useToogle';
const TRANSITIONS = ['fade', 'slide', 'none'];
const STYLES = ['default', 'dark-content', 'light-content'];

export default function App() {
  const [view, setView] = useState<number>(1);
  const [currentCodebar, setCurrentCodebar] = useState<string>("");
  const [fastMode, toggleFastMode] = useToggle(false);

  const gotoSearchEquipment = (props: any) => {
    setCurrentCodebar(props);
    setView(2);
  }

  const gotoCapturePhoto = (props: any) => {
    setCurrentCodebar(props);
    setView(4);
  }

  const gotoInit = (props: any) => {
    setCurrentCodebar('')
    setView(1)
  }

  const gotoCreateRow = (code: any) => {
    setCurrentCodebar(code)
    setView(3)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#1b1c27"
        barStyle={"light-content"}/>
        <ImageBackground source={bg} style={styles.backgroundStyle}>
          { view == 1 && <CaptureCodebarView gotoNext={gotoSearchEquipment} codebar={currentCodebar} toggleFastMode={toggleFastMode} fastMode={fastMode}/> }
          { view == 2 && <EquipmentInformationView gotoInit={gotoInit} gotoCreate={gotoCreateRow} gotoNext={gotoCapturePhoto} codebar={currentCodebar}/> }
          { view == 3 && <CreateEquipmentView gotoInit={gotoInit} codebar={currentCodebar} gotoNext={gotoCapturePhoto}/> }
          { view == 4 && <CapturePhotoView gotoInit={gotoInit} codebar={currentCodebar}/> }
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