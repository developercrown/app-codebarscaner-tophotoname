
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

import ConfigurationView from './views/ConfigurationView';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';

import { Background } from "./assets/images";

export default function App() {
  const Stack = createNativeStackNavigator();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  const options = {
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
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <ImageBackground source={Background} resizeMode="cover" style={styles.backgroundStyle}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen name="Login" component={LoginView}/>
            <Stack.Screen name="Configuration" component={ConfigurationView} options={{ title: 'Configuracion General',  }}/>
            <Stack.Screen name="Dashboard" component={DashboardView} options={{ title: 'Bienvenido' }}/>
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