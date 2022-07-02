import { Camera, CameraType, FlashMode } from "expo-camera"
import { forwardRef, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, CameraRoll } from 'react-native';
import WaitFullScreen from './WaitFullScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const CodebarScanner = (props: any) => {
    const cameraRef = useRef<any>();
    const { codebar, onStartProcess, onScan } = props;
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [torch, setTorch] = useState<boolean>(false);
    const [cameraSource, setCameraSource] = useState<CameraType>(CameraType.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            console.log('startting camera');
        })();
    }, [])

    const handleBarCodeScanned = async (props: any) => {
        let { data } = props
        if(onScan){
            onScan(data);
        }
        console.log("Code received", data);
        cameraRef.current.pausePreview()
    };

    const toggleTorch = () => {
        if(cameraSource === CameraType.front){
            ToastAndroid.show('Linterna solo disponible con la camara trasera', ToastAndroid.SHORT);
        }
        setTorch((props: any) => {
            return !props
        })
    }
    const toggleCameraSource = () => {
        if(cameraSource === CameraType.front){
            setCameraSource(CameraType.back)
        } else {
            setCameraSource(CameraType.front)
        }
    }

    //TODO: create focus method and button

    return <View style={{flex: 1}}>
        { hasPermission === null && <WaitFullScreen message="Requesting for camera permission" level={.8}/> }
        { hasPermission === false && <WaitFullScreen message="No access to camera" level={1}/> }
        {
            hasPermission &&
            <Camera
                ref={cameraRef}
                type={cameraSource}
                flashMode={torch ? FlashMode.torch : FlashMode.off}
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        }
        <View style={{
            width: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10%',
            bottom: 0
        }}>
            
        </View>
        <View style={{
            width: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            bottom: 0,
            flexDirection: 'column',
            paddingHorizontal: 20
        }}>
            <Text style={{
                color: 'white'
            }}>Apunta la camara al código</Text>
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
                        torch && cameraSource === CameraType.back  ?
                            <Ionicons name="flashlight" size={28} style={{ color: 'white' }} />
                            :
                            <Ionicons name="flashlight-outline" size={28} style={{ color: 'white' }} />
                    }
                </TouchableOpacity>
            </View>
        </View>
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