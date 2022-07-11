import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import { FormContainer, GradientButton, IconButton, Input } from "../Components/FormComponents";
import { textStyles } from "../Components/Styles";
import {LogoText} from '../assets/images';
import ScreenView from '../Components/ScreenView';
import useHeaderbar from "../hooks/useHeaderbar";
import Constants from 'expo-constants'

const LoginView = (props: any) => {
    const { navigation } = props;
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    useHeaderbar({
        hideShadow: false,
        navigation,
        rightSection: <IconButton icon="cog" color="#333" size={32} onTouch={() => navigation.navigate('Configuration')} style={{ marginTop: Constants.statusBarHeight }}/>,
        style: {
            backgroundColor: 'rgba(255, 255, 255, .8)',
        }
    });

    const handleLogin = () => {
        navigation.replace('Dashboard')
    }

    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .75)'}}>
            <View style={styles.containerTop}>
                <Image source={LogoText} style={styles.logo} />
            </View>
            <View style={styles.bodyContainer}>
                <Text style={[ textStyles.alignCenter, textStyles.colorDark, textStyles.xl, textStyles.bold, { marginTop: 10 } ]}>
                    Hola!
                </Text>
                <Text style={[ textStyles.alignCenter, textStyles.colorDark, textStyles.xs, textStyles.bold, { paddingHorizontal: 20, marginBottom: 10 } ]}>
                    Bienvenido a nuestra app de inventarios digitales
                </Text>
                <FormContainer>
                    <Input value={username} onChange={setUsername} label="Usuario"/>
                    <Input value={password} onChange={setPassword} label="Password"/>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                        <GradientButton label="Entrar" onTouch={handleLogin} />
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