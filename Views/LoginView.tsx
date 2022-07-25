import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native"



import { FormContainer, GradientButton, IconButton, Input } from "../components/FormComponents";
import { alignStyles, colors, positionStyles, textStyles } from "../components/Styles";
import ScreenView from '../components/ScreenView';

import useHeaderbar from "../hooks/useHeaderbar";

import {LogoText} from '../assets/images';
import useSound from "../hooks/useSound";

const LoginView = (props: any) => {
    const { navigation } = props;
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
        handleLogin() //TODO: remove in production
    })

    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .1)', height: '100%' }}>
            <View style={[{width: windowWidth}, alignStyles.centered]}>
                <IconButton
                    icon="cog"
                    color={colors.dark.color}
                    size={32}
                    onTouch={() => {
                        sound.touch()
                        navigation.navigate('Configuration')
                    }}
                    style={positionStyles.absoluteTopRight}/>
                <View style={[{width: windowWidth, height: 'auto'}, alignStyles.centered]}>
                    <View style={[styles.containerTop]}>
                        <Image source={LogoText} style={styles.logo} />
                    </View>
                    <View>
                        <Text style={[ textStyles.alignCenter, colors.blue, textStyles.xl, textStyles.bold, { marginTop: 20 } ]}>
                            Hola!
                        </Text>
                        <Text style={[ textStyles.alignCenter, colors.black, textStyles.xs, textStyles.bold, { paddingHorizontal: 20, marginBottom: 10 } ]}>
                            Bienvenido a nuestra app de inventarios digitales
                        </Text>
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
                                />
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                                <GradientButton label="Entrar" onTouch={handleLogin} style={{elevation: 1}}/>
                            </View>
                        </FormContainer>
                    </View>
                </View>
            </View>
        </ScreenView>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        padding: 0
    },
    logo: {
        width: 240,
        height: 240,
    }
});

export default LoginView;