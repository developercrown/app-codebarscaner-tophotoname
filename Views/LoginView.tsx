import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import { FormContainer, GradientButton, IconButton, Input } from "../Components/FormComponents";
import { colors, textStyles } from "../Components/Styles";
import {LogoText} from '../assets/images';
import ScreenView from '../Components/ScreenView';
import useHeaderbar from "../hooks/useHeaderbar";
import Constants from 'expo-constants'

const LoginView = (props: any) => {
    const { navigation } = props;
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const usernameRef = useRef<any>();
    const passwordRef = useRef<any>();
    
    useHeaderbar({
        hideShadow: false,
        navigation,
        leftSection: <View></View>,
        rightSection: <IconButton icon="cog" color={colors.dark.color} size={32} onTouch={() => navigation.navigate('Configuration')} style={{ marginTop: Constants.statusBarHeight }}/>,
        style: {
            backgroundColor: 'rgba(255, 255, 255, .4)',
        }
    });

    const handleLogin = () => {
        navigation.replace('Dashboard')
    }

    const handleNextInput = () => {
        passwordRef.current.focus()  
    }

    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .4)', height: '100%', flex: 1 }}>
            <View style={styles.containerTop}>
                <Image source={LogoText} style={styles.logo} />
            </View>
            <View style={styles.bodyContainer}>
                <Text style={[ textStyles.alignCenter, colors.blue, textStyles.xl, textStyles.bold, { marginTop: 10 } ]}>
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
        </ScreenView>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    logo: {
        width: 300,
        height: 300,
    },
    bodyContainer: {
        flex: 1
    }
});

export default LoginView;