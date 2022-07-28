
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, SafeAreaView, ImageBackground, Text, View, Image } from 'react-native';
import {useNetInfo} from "@react-native-community/netinfo";

import ConfigurationView from './views/ConfigurationView';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';

import { Background, LogoText } from "./assets/images";

import {
  useFonts,
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black
} from '@expo-google-fonts/roboto';

import {
  Nunito_200ExtraLight,
  Nunito_200ExtraLight_Italic,
  Nunito_300Light,
  Nunito_300Light_Italic,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_700Bold_Italic,
  Nunito_800ExtraBold,
  Nunito_800ExtraBold_Italic,
  Nunito_900Black,
  Nunito_900Black_Italic,
} from '@expo-google-fonts/nunito';
import { textStyles } from './components/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

export default function App() {
  const netInfo = useNetInfo();
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


  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,

    Nunito_200ExtraLight,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light,
    Nunito_300Light_Italic,
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_600SemiBold,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black,
    Nunito_900Black_Italic, 
  });

  if (!fontsLoaded) {
      return <SafeAreaView style={[styles.container]}>
        <View style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={[{}]}>
              <Image source={LogoText} style={{width: 280, height: 280}} />
          </View>
          <Text>Cargando aplicación</Text>
        </View>
      </SafeAreaView>
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ImageBackground source={Background} resizeMode="cover" style={styles.backgroundStyle}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen name="Login" component={LoginView}/>
            <Stack.Screen name="Configuration" component={ConfigurationView} options={{ title: 'Configuracion General'  }}/>
            <Stack.Screen name="Dashboard" component={DashboardView} options={{ title: 'Bienvenido' }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ImageBackground>
      
      {
        !netInfo.isConnected && <View style={{backgroundColor: 'rgba(255, 255, 255, .9)', width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons name="warning" size={100} style={[{ color: 'rgba(200, 50, 50, 1)' }]} />
          <Text style={[textStyles.sm, textStyles.bold]}>No tienes conección a internet</Text>
        </View>
      }
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