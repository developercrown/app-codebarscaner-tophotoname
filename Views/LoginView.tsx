import { useLayoutEffect, useState } from "react";
import { Button, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import LogoText from '../assets/images/logoText.png';
import Logo from '../assets/images/logo.png';
import AppName from '../assets/images/appname.png';
import { GradientButton } from "../Components/FormComponents";
import { formStyles, textStyles } from "../Components/Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants'

const headerStyles = StyleSheet.create({
    header: {
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    appName: {
        width: 200,
        height: 40,
        marginLeft: 6
    },
    headerLogo: {
        width: 45,
        height: 30,
    }
});

const LogoTitle = (props: any) => {
    return <View style={[headerStyles.header, { marginTop: Constants.statusBarHeight }]}>
        <Image source={Logo} style={headerStyles.headerLogo} />
        <Image source={AppName} style={headerStyles.appName} />
    </View>
}

const LoginView = (props: any) => {
    const { navigation } = props;
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    useLayoutEffect(() => {
        navigation.setOptions(options);
    }, [navigation]);

    const handleLogin = () => {
        alert("Login")
    }

    const handleConfig = () => {
        alert("Config")
    }

    const options = {
        // headerStyle: {
        //     backgroundColor: 'rgba(255, 255, 255, .8)',
        // },
        // headerShadowVisible: false,
        headerTitle: (props: any) => <LogoTitle {...props} />,
        headerRight: () => (
            <TouchableOpacity onPress={handleConfig} style={[headerStyles.header, { marginTop: Constants.statusBarHeight }]}>
                <Ionicons name="cog" size={32} style={{ color: '#333' }} />
            </TouchableOpacity>
        )
    };

    return <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
            <View style={styles.containerTop}>
                <View>
                    <Image source={LogoText} style={styles.logo} />
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <View>
                    <Text style={[
                        textStyles.alignCenter,
                        textStyles.colorDark,
                        textStyles.xl,
                        textStyles.bold,
                        {
                            marginTop: 10
                        }
                    ]}>Hola!</Text>
                    <Text style={[
                        textStyles.alignCenter,
                        textStyles.colorDark,
                        textStyles.xs,
                        textStyles.bold,
                        {
                            paddingHorizontal: 20,
                            marginBottom: 10
                        }
                    ]}>Bienvenido a nuestra app de inventarios digitales</Text>
                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={"padding"}
                    enabled
                >
                    <View style={styles.formContainer}>
                        <View style={formStyles.inputContainer}>
                            <Text style={[
                                textStyles.alignLeft,
                                textStyles.colorDark,
                                textStyles.xs,
                                textStyles.bold,
                                {
                                    marginTop: 10
                                }
                            ]}>Usuario:</Text>
                            <TextInput value={username} onChangeText={setUsername} style={formStyles.input} />
                        </View>

                        <View style={formStyles.inputContainer}>
                            <Text style={[
                                textStyles.alignLeft,
                                textStyles.colorDark,
                                textStyles.xs,
                                textStyles.bold,
                                {
                                    marginTop: 10
                                }
                            ]}>Usuario:</Text>
                            <TextInput value={username} onChangeText={setUsername} style={formStyles.input} />
                        </View>


                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <GradientButton label="Entrar" onTouch={handleLogin} />
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, .75)',
    },
    container: {
        flex: 1,
        paddingVertical: 10,
    },
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
    },
    formContainer: {
        flex: 1,
        marginTop: 10
    }
});

export default LoginView;