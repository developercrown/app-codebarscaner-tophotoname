import { Alert, BackHandler, Dimensions, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LogoText } from '../assets/images';
import { FormContainer, GradientButton, IconButton, TextArea } from "../components/FormComponents";
import ScreenView from '../components/ScreenView';
import { useEffect, useState } from 'react';
import useHeaderbar from "../hooks/useHeaderbar";
import { alignStyles, background, fontStyles, positionStyles, textStyles } from "../components/Styles";
import useSound from "../hooks/useSound";
import InternalHeader from "../components/InternalHeader";
import Ionicons from '@expo/vector-icons/Ionicons';
import useAxios from "../hooks/useAxios";
import useLocalStorage from "../hooks/useLocalStorage";

const ConfigurationView = (props: any) => {
    const { navigation, route } = props;
    const exitOnBack = route.params?.exitOnBack;

    const { instance } = useAxios();

    const {get, set} = useLocalStorage();

    const windowWidth = Dimensions.get('window').width;
    const [appServer, setAppServer] = useState('');
    const [authServer, setAuthServer] = useState('');
    const [wait, setWait] = useState<boolean>(false);
    const [processMessages, setProcessMessages] = useState<any>([]);

    const sound = useSound();

    const handleBack = () => {
        if (exitOnBack) {
            sound.deny();
            Alert.alert('Atención!', 'Es necesario que termine de configurar la app para poder usarla!', [
                {
                    text: 'Continuar'
                },
                {
                    text: 'Salir de la app',
                    onPress: () => {
                        BackHandler.exitApp();
                    }
                }
            ])
            return
        }
        sound.back();
        navigation.goBack()
        return
    }

    const validateValue = (value: any) => {
        value = (value + '').trim()
        return (
            value !== undefined &&
            value !== null &&
            value !== '' &&
            value.length > 0
        )
    }

    const setDefaults = (data: any) => {
        if(data && data.app && data.auth){
            setAppServer(data.app)
            setAuthServer(data.auth)
            return
        }
    }

    const handleDefaults = (data: any) => {
        setAppServer('https://api-inventario-minify.upn164.edu.mx/api/v1')
        setAuthServer('https://api-shield.upn164.edu.mx/api/v1')
    }

    useHeaderbar({
        hide: true, navigation
    });

    const appendMessage = (message: string, clear: boolean = false) => {
        if (clear) {
            setProcessMessages((state: any) => {
                return [
                    message
                ]
            })
            return
        }
        setProcessMessages((state: any) => {
            return [
                ...state,
                message
            ]
        })
    }

    const validateServer = (server: any) => {
        return new Promise((resolve) => {
            instance.get(`${server}/ping`).then((response: any) => {
                resolve(true)
            }).catch((error: any) => {
                resolve(false)
            })
        })
    }

    const save = () => {
        if (validateValue(appServer) && validateValue(authServer)) {
            appendMessage('Iniciando proceso de validación', true)
            setWait(true)
            setTimeout(() => {
                appendMessage('')
                appendMessage('Validando comunicación con el servidor de la app:')
                appendMessage(appServer)
                validateServer(appServer).then((result) => {
                    if (result) {
                        setTimeout(() => {
                            appendMessage('')
                            appendMessage('Validando comunicación con el servidor de autenticación:')
                            appendMessage(authServer)
                            validateServer(authServer).then((result) => {
                                if (result) {
                                    const data = {
                                        app: appServer,
                                        auth: authServer
                                    };
                                    
                                    set('servers', data, true).then((result) => {
                                        Alert.alert('Validacion finalizada!', `Ahora haz clic en continuar para usar la app."`, [{
                                            text: 'Continuar', onPress: () => {
                                                setWait(false)
                                                navigation.replace('Login')
                                            }
                                        }])
                                        sound.success();
                                    })
                                    
                                    return
                                }
                                Alert.alert('Ocurrio un error!', `La validación del servidor "${authServer}" ha fallado, verifique su información.`, [{ text: 'Continuar', onPress: () => setWait(false) }])
                                sound.error();
                            })
                        }, 150);
                        return
                    }
                    Alert.alert('Ocurrio un error!', `La validación del servidor "${appServer}" ha fallado, verifique su información.`, [{ text: 'Continuar', onPress: () => setWait(false) }])
                    sound.error();
                })
            }, 150);
            return
        }
        alert('Ingresa los valores requeridos por favor!')
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleBack()
            return true;
        });
        return () => {
            backHandler.remove()
        };
    }, []);

    useEffect(() => {
        get('servers', true).then(dataServers => {
            if (dataServers) {
                setDefaults(dataServers)
            }
        })
    }, [])

    return <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)' />
        {
            !wait ? <>
                <ScreenView style={{ backgroundColor: 'rgba(255, 255, 255, .6)', height: '100%' }}>
                    <InternalHeader title="Configuración de la app" leftIcon="chevron-back" leftAction={handleBack} rightIcon="flag" rightAction={handleDefaults} style={{ backgroundColor: 'rgba(40, 40, 40, 1)' }} />
                    <View style={[{ width: windowWidth }, alignStyles.centered]}>
                        <View style={styles.containerTop}>
                            <Image source={LogoText} style={styles.logo} />
                        </View>
                        <View style={styles.bodyContainer}>
                            <FormContainer style={[styles.bodyContainer, { alignItems: 'center' }]}>
                                <TextArea fontSize={16} value={authServer} onChange={setAuthServer} label="URL del Servidor de autenticación" style={{ width: windowWidth - 50, elevation: 1 }} />
                                <TextArea fontSize={16} value={appServer} onChange={setAppServer} label="URL del servidor de la app" style={{ marginTop: 0, width: windowWidth - 50, elevation: 1 }} />
                                <TouchableOpacity
                                    onPress={save}
                                    style={[background.darkgreen, { width: '80%', height: 50, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: 'white', marginRight: 10 }}>Guardar configuracion</Text>
                                    <Ionicons name="save-outline" size={28} style={{ color: 'white' }} />
                                </TouchableOpacity>
                            </FormContainer>
                        </View>
                    </View>
                </ScreenView>
            </> : <View style={{ backgroundColor: 'rgba(255, 255, 255, .75)', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {
                    processMessages && processMessages.length > 0 && processMessages.map((message: any, key: number) => {
                        return <Text
                            key={key}
                            style={[fontStyles.nunitoBold]}
                        >{message}</Text>
                    })
                }
            </View>
        }
    </>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    logo: {
        width: 200,
        height: 200,
    },
    bodyContainer: {
        flex: 1,
        marginTop: 10,
    }
});

export default ConfigurationView;