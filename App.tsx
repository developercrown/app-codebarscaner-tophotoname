import { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import CaptureCodebarView from './Components/CaptureCodebarView';
const TRANSITIONS = ['fade', 'slide', 'none'];
const STYLES = ['default', 'dark-content', 'light-content'];

export default function App() {
  const [view, setView] = useState<number>(1);

  const gotoCapturePhoto = (props: any) => {
    console.log(props);
    setView(2);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#401c80"
        barStyle={"light-content"}/>
      { view == 1 && <CaptureCodebarView gotoNext={gotoCapturePhoto}/> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
  }
});