import { Camera, CameraType, FlashMode } from "expo-camera"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import WaitFullScreen from './WaitFullScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const CodebarScanner = (props: any, ref: any) => {
    const { codebar, onScan } = props;

    useImperativeHandle(ref, () => ({
        reset: resetAction
    }));

    const cameraRef = useRef<any>();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [torch, setTorch] = useState<boolean>(false);
    const [cameraSource, setCameraSource] = useState<CameraType>(CameraType.back);

    const fadePulseView = useRef(new Animated.Value(0)).current;
    const fadePulseText = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {            
        Animated.sequence([
            Animated.timing(fadePulseView, {
                useNativeDriver: true,
                toValue: 1,
                duration: 400
            }),
            Animated.timing(fadePulseView, {
                useNativeDriver: true,
                toValue: 0.2,
                duration: 400
            }),
        ]).start(() => {
            if(hasPermission){
                fadeIn();
            }
        });
    };

    const pulseText = () => {    
        Animated.sequence([
            Animated.timing(fadePulseText, {
                useNativeDriver: true,
                toValue: 1,
                duration: 1000
            }),
            Animated.timing(fadePulseText, {
                useNativeDriver: true,
                toValue: 0.2,
                duration: 1000
            }),
        ]).start(() => {
            if(!hasPermission){
                pulseText();
            }
        });
    };

    useEffect(() => {
        (async () => {
            fadeIn();
            pulseText();
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            console.log('startting camera');
        })();
    }, [])

    const handleBarCodeScanned = async (props: any) => {
        let { data } = props
        if (onScan) {
            onScan(data);
        }
        console.log("Code received", data);
    };

    const toggleTorch = () => {
        if (cameraSource === CameraType.front) {
            ToastAndroid.show('Linterna solo disponible con la camara trasera', ToastAndroid.SHORT);
        }
        setTorch((props: any) => {
            return !props
        })
    }
    const toggleCameraSource = () => {
        if (cameraSource === CameraType.front) {
            setCameraSource(CameraType.back)
        } else {
            setCameraSource(CameraType.front)
        }
    }

    const resetAction = () => {
        console.log('resetAction');
    }

    return <View style={[{flex: 1 }
    ]}>
        {hasPermission === null && <WaitFullScreen level={.8}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Animated.View style={{opacity: fadePulseView}}>
                    <Ionicons name="warning" size={60} style={{ color: 'white' }} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Solcitando permiso para usar la camara</Text>
            </View>

        </WaitFullScreen>}
        {hasPermission === false && <WaitFullScreen level={.8}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Animated.View style={{opacity: fadePulseView}}>
                    <Ionicons name="warning" size={60} style={{ color: 'rgba(240, 10, 10, 1)' }} />
                </Animated.View>
                <Text style={{ color: 'white' }}>No tenemos acceso para usar la camara</Text>
            </View>

        </WaitFullScreen>}
        {
            hasPermission &&
            <Camera
                focusDepth={1}
                ref={cameraRef}
                type={cameraSource}
                flashMode={torch ? FlashMode.torch : FlashMode.off}
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        }
        <TouchableWithoutFeedback>
            <View style={{
                opacity: 0.8,
                width: '100%',
                height: '100%',
                position: 'absolute',
                justifyContent: 'flex-end',
                alignItems: 'center',
                bottom: 0,
                flexDirection: 'column',
                padding: 20
            }}>
                <Animated.Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    top: 20,
                    position: 'absolute',
                    opacity: fadePulseText
                }}>Apunta la camara al código a escanear</Animated.Text>
                <View style={
                    {
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10
                    }
                }>
                    <TouchableOpacity
                        onPress={toggleCameraSource}
                        style={controlsStyles.button}>
                        {
                            cameraSource === CameraType.front ?
                                <Ionicons name="camera-reverse" size={28} style={{ color: 'white' }} />
                                :
                                <Ionicons name="camera-reverse-outline" size={28} style={{ color: 'white' }} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleTorch}
                        style={controlsStyles.button}>
                        {
                            torch && cameraSource === CameraType.back ?
                                <Ionicons name="flashlight" size={28} style={{ color: 'white' }} />
                                :
                                <Ionicons name="flashlight-outline" size={28} style={{ color: 'white' }} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </View>
}

const controlsStyles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        borderRadius: 30,
        width: 60,
        height: 60,
        padding: 10,
        margin: 8
    },
});

export default forwardRef(CodebarScanner);