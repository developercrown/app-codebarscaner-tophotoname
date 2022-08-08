import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native"

import { FormContainer, GradientButton, IconButton, Input } from "../components/FormComponents";
import { alignStyles, colors, fontStyles, positionStyles, textStyles } from "../components/Styles";
import ScreenView from '../components/ScreenView';

import useHeaderbar from "../hooks/useHeaderbar";

import { LogoText } from '../assets/images';
import useSound from "../hooks/useSound";
import Constants from 'expo-constants';
import useLocalStorage from "../hooks/useLocalStorage";
import ConfigContext from "../context/ConfigProvider";
import useValidate from "../hooks/useValidate";
import useAxios from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";

const LoginView = (props: any) => {
    const { navigation } = props;
    const { get, set, remove } = useLocalStorage();
    const { config, requestConfig } : any = useContext(ConfigContext);
    const { setAuth } : any = useContext(AuthContext);
    const {instance, getHeaderInstance} = useAxios(config?.servers?.auth);
    const { required } : any = useValidate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const usernameRef = useRef<any>();
    const passwordRef = useRef<any>();

    const windowWidth = Dimensions.get('window').width;

    const [wait, setWait] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<any>(null);
    const [message, setMessage] = useState<string>('Iniciando');

    const sound = useSound();

    useHeaderbar({ hide: true, navigation });

    const refuse = () => {
        sound.notification()
        alert('La información ingresada es incorrecta, verifique los datos ingresados')
        setWait(false)
    }

    const gotoDashboard = (token: string|null, data: any) => {
        set('token', token).then(result => {
            setAuth({
                token,
                data
            })
            setTimeout(() => {
                navigation.replace('Dashboard')
            }, 500);
        })
    }

    const logon = (token: string, remember: boolean = true) => {
        const headers = getHeaderInstance({Authorization: `Bearer ${token}`});
        const config = {
            headers,
            validateStatus: () => true
        }
        setWait(true)
        instance.post('public/account/logon', {}, config).then((response: any) => {
            const { data, status } = response;
            if(status===200){
                setAuthenticated(data)
                setWait(false)
                gotoDashboard(token, data);
                return
            } else if(status===401){
                sound.deny()
                Alert.alert('Error!', 'Tu sessión ha expirado, por favor ingresa nuevamente tu información de acceso', [
                    {
                        text: 'Continuar'
                    }
                ]);
                remove('token').then(result => {
                    setAuth(null);
                    navigation.replace('Login')
                });
                return
            }            
            refuse()
        }).catch((err: any) => {
            refuse()
        });
    }

    const login = (user: string, pass: string) => {
        const payload = {
            data:{
                type: "user",
                attributes: {
                    username: user,
                    password: pass,
                    system: "app-inventory"
                }
            }
        }
        const config = {
            validateStatus: () => true
        }
        setMessage('Solicitando ingreso al sistema');
        setWait(true)
        instance.post('public/account/login', payload, config).then((response: any) => {
            const { data, status } = response
            if(status===200){
                logon(data.token)
                return
            }
            refuse()
        }).catch((err: any) => {
            refuse()
        });
    }
    

    const handleLogin = () => {
        if(
            required(username) &&
            required(password)
        ){
            login(username, password)
            return
        }
        alert('Por favor completa la información requerida')
    }

    const handleNextInput = () => {
        passwordRef.current.focus()
    }

    useEffect(() => {
        //TODO: Implement get multiple
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

    useEffect(() => {
        if(config && config.status && config.servers.auth){
            get('token').then((dataSession: any) => {
                if (!dataSession) {
                    setWait(false)
                    console.log('no session');
                    return
                }
                setMessage('Verificando tu sessión')
                setWait(true)
                logon(dataSession)
            })
        }
        
    }, [config])

    return <>
        {
            wait && <View style={[styles.waitView]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    { paddingTop: 10 }
                ]}>{message}</Text>
            </View>
        }
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

                {
                    !authenticated ? <>
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
                    </>
                    :
                    <>
                        <ActivityIndicator size="large" color="blue" />
                        <Text style={[
                            fontStyles.nunitoBold,
                            textStyles.alignCenter,
                            textStyles.md,
                            colors.brown,
                            { paddingTop: 10, color: '#333' }
                        ]}>Bienvenido {authenticated.firstname}!</Text>
                    </>
                }
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
    },
    waitView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 99
    },
});

export default LoginView;