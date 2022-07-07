
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import LoginView from './Views/LoginView';
import background from "./assets/images/background.jpg";

export default function App() {
  const Stack = createNativeStackNavigator();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ImageBackground source={background} resizeMode="cover" style={styles.backgroundStyle}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={{
            cardStyle: {
              backgroundColor: 'red',
            },
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              elevation: 0,
              shadowOpacity: 0
            },
            backgroundColor: 'red',
          }}>
            <Stack.Screen name="Login" component={LoginView}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  }
});

// import { useState } from 'react';
// import CaptureCodebarView from './Views/CaptureCodebarView';
// import CapturePhotoView from './Views/CapturePhotoView';
// import EquipmentInformationView from './Views/Equipment/EquipmentInformationView';
// import CreateEquipmentView from './Views/CreateEquipmentView';
// import useToggle from './hooks/useToogle';


// const TRANSITIONS = ['fade', 'slide', 'none'];
// const STYLES = ['default', 'dark-content', 'light-content'];

/* <StatusBar
        animated={true}
        backgroundColor="#1b1c27"
        barStyle={"light-content"}/>
        <ImageBackground source={bg} style={styles.backgroundStyle}>
          { view == 1 && <CaptureCodebarView gotoNext={gotoSearchEquipment} codebar={currentCodebar} toggleFastMode={toggleFastMode} fastMode={fastMode}/> }
          { view == 2 && <EquipmentInformationView gotoInit={gotoInit} gotoCreate={gotoCreateRow} gotoNext={gotoCapturePhoto} codebar={currentCodebar} fastMode={fastMode}/> }
          { view == 3 && <CreateEquipmentView gotoInit={gotoInit} codebar={currentCodebar} gotoNext={gotoCapturePhoto} fastMode={fastMode}/> }
          { view == 4 && <CapturePhotoView gotoInit={gotoInit} codebar={currentCodebar} fastMode={fastMode}/> }
        </ImageBackground> */

        // const [view, setView] = useState<number>(1);
        // const [currentCodebar, setCurrentCodebar] = useState<string>("");
        // const [fastMode, toggleFastMode] = useToggle(false);
      
        // const gotoSearchEquipment = (props: any) => {
        //   setCurrentCodebar(props);
        //   setView(2);
        // }
      
        // const gotoCapturePhoto = (props: any) => {
        //   setCurrentCodebar(props);
        //   setView(4);
        // }
      
        // const gotoInit = (props: any) => {
        //   setCurrentCodebar('')
        //   setView(1)
        // }
      
        // const gotoCreateRow = (code: any) => {
        //   setCurrentCodebar(code)
        //   setView(3)
        // }