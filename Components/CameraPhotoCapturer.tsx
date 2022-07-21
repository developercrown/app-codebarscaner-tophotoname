import { Camera, CameraType, FlashMode, WhiteBalance } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, ImageBackground, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import useSound from '../hooks/useSound';
import * as MediaLibrary from 'expo-media-library';
import Ionicons from '@expo/vector-icons/Ionicons';
import { alignStyles, colors, textStyles } from "./Styles";
import Slider from '@react-native-community/slider';
import FullScreenImage from "./FullScreenImage";

const cameraQualityOptions = [
    {
        value: .5,
        label:'SD',
    },
    {
        value: 1,
        label:'HD',
    }
]

const whiteBalanceOptions = [
    {
        value: WhiteBalance.auto,
        label:'Auto',
    },
    {
        value: WhiteBalance.sunny,
        label:'Soleado',
    },
    {
        value: WhiteBalance.cloudy,
        label:'Nublado',
    },
    {
        value: WhiteBalance.shadow,
        label:'Sombra',
    },
    {
        value: WhiteBalance.incandescent,
        label:'Incandecente',
    },
    {
        value: WhiteBalance.fluorescent,
        label:'Fluorecente',
    }
]

const CameraPhotoCapturer = (props: any) => {
    const {handleBack, handleSuccess} = props;
    const iconSize = 32;

    const [wait, setWait] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const [cameraStatus, setCameraStatus] = useState<boolean | undefined>()

    // Camera Functionalities States
    const [cameraSource, setCameraSource] = useState<CameraType>(CameraType.back);
    const [cameraRatio, setCameraRatio] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean | undefined>(false);
    const [whiteBalanceIndex, setWhiteBalanceIndex] = useState<number>(0);
    const [qualityLevelIndex, setQualityLevelIndex] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(0);

    const sound = useSound();
    const cameraRef = useRef<any>();

    const requestCameraPermission: any = async () => (await Camera.requestCameraPermissionsAsync()).status;
    const requestMediaLibraryPermission: any = async () => (await MediaLibrary.requestPermissionsAsync()).status;

    useEffect(() => {
        (async () => {
            const cameraAccess = await requestCameraPermission();
            const mediaPermission = await requestMediaLibraryPermission();
            setHasPermission(cameraAccess === 'granted' && mediaPermission === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View style={styles.container}/>;
    }

    if (hasPermission === false) {
        return <View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
            <Ionicons name="alert-circle" size={60} style={ [colors.white] } />
            <Text style={[colors.white]}>La app no tiene acceso a la camara autorizado.</Text>
        </View>;
    }

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

    const toggleQualityResolution  = () => {
        if(qualityLevelIndex < cameraQualityOptions.length-1) {
            setQualityLevelIndex(qualityLevelIndex+1);
        } else {
            setQualityLevelIndex(0)
        }
    }

    const changeWhiteBalance = () => {
        if(whiteBalanceIndex < whiteBalanceOptions.length-1) {
            setWhiteBalanceIndex(whiteBalanceIndex+1);
        } else {
            setWhiteBalanceIndex(0)
        }
    }

    const gotoDiscartPicture = () => {
        setPhoto(null);
        setWait(false);
    }

    const takePhoto = async () => {
        if(cameraStatus){
            if (cameraRef) {
                setWait(true);
                sound.photo();
                const options = {
                    quality: cameraQualityOptions[qualityLevelIndex].value, 
                    fixOrientation: false,
                    exif: false,
                };
                const cam = (cameraRef as any).current;
                const photo = await cam.takePictureAsync(options);
                setPhoto(photo);
                setWait(false);
            }
            
            return
        }
    }

    const savePhoto = async () => {
        setWait(true);
        if(handleSuccess){
            handleSuccess(photo)
        }
    }

    if(photo){
        return  <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <FullScreenImage image={photo}/>
            <View style={styles.controlsContainerBottom}>
                <TouchableOpacity
                    onPress={gotoDiscartPicture}
                    style={[styles.button]}>
                    <Ionicons name="trash" size={40} style={{ color: 'white' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={savePhoto}
                    style={[styles.button,]}>
                    <Ionicons name="save" size={40} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        </View>
    }
    
    return  <View style={styles.container}>
        {
            wait && <View style={[styles.wait, alignStyles.centered]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    {paddingTop: 10}
                ]}>Capturando la imagen</Text>
            </View>
        }
        <View style={styles.container}>
            <Camera
                zoom={zoom}
                flashMode={torch ? FlashMode.torch : FlashMode.off}
                ratio={cameraRatio ? '4:3' : '16:9'}
                whiteBalance={whiteBalanceOptions[whiteBalanceIndex].value}
                onCameraReady={() => { setCameraStatus(true) }}
                style={styles.camera}
                type={cameraSource}
                ref={cameraRef}
            />
            
            <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name="add-sharp" size={60} style={ [colors.white, {opacity: 0.4}] } />
            </View>
            
            <View style={styles.controlsContainer}>
                <View
                    style={styles.controlsContainerTop}
                >
                    <TouchableOpacity
                        onPress={handleBack}
                        style={[
                            styles.button
                        ]}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={"chevron-back"} size={iconSize} style={{ color: 'white' }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleTorch}
                        style={[
                            styles.button
                        ]}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name={torch ? "flash" : "flash-off"} size={iconSize} style={{ color: 'white' }} />
                            <Text style={[textStyles.nano, colors.white]}>{torch ? 'Activo' : 'Apagado'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleCameraSource}
                        style={styles.button}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Ionicons name={cameraSource === CameraType.front ? "camera-reverse" : "camera-reverse-outline"} size={iconSize} style={{ color: 'white' }} />
                                <Text style={[textStyles.nano, colors.white]}>{cameraSource === CameraType.front ? 'Frontal' : 'Trasera'}</Text>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleQualityResolution}
                        style={styles.button}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Ionicons name={"aperture"} size={iconSize} style={{ color: 'white' }} />
                                <Text style={[textStyles.nano, colors.white]}>{cameraQualityOptions[qualityLevelIndex].label}</Text>
                            </View>
                    </TouchableOpacity>
                </View>

                <View style={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    padding: 0,
                    margin: 0,
                    zIndex: 1
                }}>
                        <Slider
                            style={{
                                left: 60,
                                width: 200,
                                height: 40,
                                transform: [{
                                    rotate: '-90deg'
                                }]
                            }}
                            minimumValue={0}
                            maximumValue={1}
                            vertical={false}
                            step={0.1}
                            thumbTintColor='white'
                            onValueChange={setZoom}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            />
                </View>
                
                <View style={styles.controlsContainerBottom}>

                    <TouchableOpacity
                        onPress={()=>setCameraRatio(!cameraRatio)}
                        style={[
                            styles.button
                        ]}>
                            <View style={{
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Ionicons name={cameraRatio ? 'tablet-portrait-outline' : 'tablet-landscape-outline'} size={iconSize} style={{ color: 'white' }} />
                                <Text style={[
                                    textStyles.bold,
                                    colors.white
                                ]}>{
                                        cameraRatio ? '4:3' : '16:9'
                                }</Text>
                            </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={takePhoto}
                        style={[styles.button, styles.buttonCamera]}>
                            <View style={{
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                }}>
                                    <Ionicons name="radio-button-on" size={60} style={ colors.red } />
                                </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={changeWhiteBalance}
                        style={[styles.button]}>
                            <View style={{
                                width: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                                }}>
                                <Ionicons name={'sunny'} size={iconSize} style={{ color: 'white' }} />
                                <Text style={[colors.white, textStyles.bold, textStyles.pico]}> 
                                    {whiteBalanceOptions[whiteBalanceIndex].label}
                                </Text>
                            </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    wait: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        width: '100%',
        height: '100%',
        top: 0,
        position: 'absolute',
        zIndex: 99
    },
    camera: {
        flex: 1,
    },
    controlsContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    controlsContainerTop: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        position: 'absolute',
        height: 100,
        width: '100%',
        top: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 10,
        zIndex: 2
    },
    controlsContainerBottom: {
        backgroundColor: 'rgba(0, 0, 0, .8)',
        borderRadius: 100,
        position: 'absolute',
        width: '90%',
        height: 100,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 2
    },
    button: {
        // width: 10,
        // height: 40,
    },
    buttonCamera: {
        // backgroundColor: 'pink', 
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0
    }
});

export default CameraPhotoCapturer