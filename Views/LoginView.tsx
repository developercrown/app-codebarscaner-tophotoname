import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native"

import { FormContainer, GradientButton, IconButton, Input } from "../components/FormComponents";
import { alignStyles, colors, positionStyles, textStyles } from "../components/Styles";
import ScreenView from '../components/ScreenView';

import useHeaderbar from "../hooks/useHeaderbar";

import { LogoText } from '../assets/images';
import useSound from "../hooks/useSound";
import Constants from 'expo-constants';
import useLocalStorage from "../hooks/useLocalStorage";
import ConfigContext from "../context/ConfigProvider";

const LoginView = (props: any) => {
    const { navigation } = props;
    const { get } = useLocalStorage();
    const { config, requestConfig } : any = useContext(ConfigContext);

    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const usernameRef = useRef<any>();
    const passwordRef = useRef<any>();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const sound = useSound();

    useHeaderbar({ hide: true, navigation });

    const handleLogin = () => {
        navigation.replace('Dashboard')
    }

    const handleNextInput = () => {
        passwordRef.current.focus()
    }

    useEffect(() => {
        get('servers', true).then(dataServers => {
            if (!dataServers) {
                sound.notification()
                Alert.alert('Atención!', 'No se han configurado los datos de comunicación, es necesario que los ingreses antes de usar la app', [
                    {
                        text: 'Continuar', onPress: () => navigation.replace('Configuration', { exitOnBack: true })
                    }
                ])
                return
            }
            requestConfig(dataServers)
        })
    }, [])

    return <>
        <IconButton
            icon="cog"
            color={colors.dark.color}
            size={32}
            onTouch={() => {
                sound.touch()
                navigation.navigate('Configuration')
            }}
            style={[positionStyles.absoluteTopRight, { zIndex: 10 }]} />
        <ScreenView style={{ backgroundColor: 'rgba(255, 255, 255, .75)', paddingTop: Constants.statusBarHeight, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={[{ width: windowWidth, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>

                <View style={[styles.containerTop]}>
                    <Image source={LogoText} style={styles.logo} />
                </View>

                <View>
                    <Text style={[textStyles.alignCenter, colors.blue, textStyles.xl, textStyles.bold, { marginTop: 20 }]}>
                        Hola!
                    </Text>
                    <Text style={[textStyles.alignCenter, colors.black, textStyles.xs, textStyles.bold, { paddingHorizontal: 20, marginBottom: 10 }]}>
                        Bienvenido a nuestra app de inventarios digitales
                    </Text>
                </View>
                <FormContainer>
                    <Input
                        icon="person"
                        label="Usuario"
                        onChange={setUsername}
                        onSubmit={handleNextInput}
                        placeholder="Ingresa tu nombre de usuario"
                        ref={usernameRef}
                        type="text"
                        value={username}
                        style={{ backgroundColor: 'white', elevation: 1 }}
                    />

                    <Input
                        icon="key"
                        label="Password"
                        onChange={setPassword}
                        onSubmit={handleLogin}
                        placeholder="Ingresa tu contraseña"
                        ref={passwordRef}
                        type="password"
                        value={password}
                        style={{ backgroundColor: 'white', elevation: 1 }}
                    />
                </FormContainer>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                    <GradientButton label="Entrar" onTouch={handleLogin} style={{ elevation: 1 }} />
                </View>
            </View>

        </ScreenView>
    </>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 240,
        height: 240,
    }
});

export default LoginView;