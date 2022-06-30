import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import useSound from '../hooks/useSound';

const CapturePhotoView = (props: any) => {
    const sound = useSound(); 
    const { codebar, gotoInit } = props;
    const cameraRef = useRef<any>();
    const [hasPermission, setHasPermission] = useState<boolean | undefined>(false);
    const [torch, setTorch] = useState<boolean | undefined>(false);
    const [cameraStatus, setCameraStatus] = useState<boolean | undefined>()
    const [photo, setPhoto] = useState<any>();
    const [captured, setCaptured] = useState<any>();
    const [wait, setWait] = useState<boolean>(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', ()=>true);
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaPermission = await MediaLibrary.requestPermissionsAsync();
            setHasPermission(cameraPermission.status === 'granted' && mediaPermission.status === 'granted');
        })();
        return () => backHandler.remove();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const gotoBack = () => {
        gotoInit()
    }

    const toogleTorch = () => {
        setTorch((props: any) => {
            return !props
        })
    }

    const takePhoto = async () => {
        setWait(true);
        if (cameraRef) {
            const options = {
                quality: .5,
                fixOrientation: true,
                exif: true,
            };
            const cam = (cameraRef as any).current;
            const photo = await cam.takePictureAsync(options);
            setPhoto(photo);
            setCaptured(true);
            sound.msn3();
        }
        setWait(false);
    }

    const gotoDiscartPicture = () => {
        setCaptured(false);
        setPhoto(null);
        setWait(false);
    }

    const savePhoto = async () => {
        setWait(true);
        try {
            let uriArray = photo.uri.split('/');
            let nameToChange = uriArray[uriArray.length - 1];
            let renamedURI = photo.uri.replace(
                nameToChange,
                "picture_" + codebar + '.jpg',
            );
            const options = {from: photo.uri, to: renamedURI}
            await FileSystem.copyAsync(options);
            let asset = await MediaLibrary.createAssetAsync(renamedURI);            
            const album = await MediaLibrary.getAlbumAsync('DevcrownPictures');
            let test = null;
            if (album == null) {
                test = await MediaLibrary.createAlbumAsync('DevcrownPictures', asset, false);
            } else {
                test = await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            if(test){
                gotoDiscartPicture()
                setTimeout(() => {
                    gotoInit()
                }, 500);
            }
        } catch (e) {
            //console.log('error', e);
            
        }
        setWait(false)
    }

    return <View style={containerStyles.container}>
        {
            wait &&
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    zIndex: 2
                }}
            >
                <Text style={{ color: '#eee' }}>Un momento por favor...</Text>
            </View>
        }
        <View style={headerStyles.container}>
            <Text style={headerStyles.title}>Captura de Fotografia: {codebar}</Text>
        </View>
        <View style={bodyStyles.container}>
            {
                captured ? <>
                    <View style={bodyStyles.containerCamera}>
                        <ImageBackground
                            source={{ uri: photo && photo.uri }}
                            style={{
                                flex: 1
                            }}
                        />
                    </View>
                    <View style={bodyStyles.containerControls}>
                        <TouchableOpacity
                            onPress={gotoDiscartPicture}
                            style={[bodyStyles.buttonCycled, bodyStyles.buttonDanger]}>
                            <Ionicons name="trash" size={40} style={{ color: 'white' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={savePhoto}
                            style={[bodyStyles.buttonCycled, bodyStyles.buttonDark]}>
                            <Ionicons name="save" size={40} style={{ color: 'white' }} />
                        </TouchableOpacity>
                    </View>
                </> : <>
                    <View style={bodyStyles.containerCamera}>
                        <Camera
                            flashMode={torch ? FlashMode.torch : FlashMode.off}
                            onCameraReady={() => { setCameraStatus(true) }}
                            style={bodyStyles.camera}
                            type={CameraType.back}
                            ref={cameraRef}
                        />
                    </View>
                    <View style={bodyStyles.containerControls}>
                        {
                            cameraStatus && <>
                                <TouchableOpacity
                                    onPress={gotoBack}
                                    style={[bodyStyles.buttonCycled, bodyStyles.buttonDanger]}>
                                    <Ionicons name="close" size={40} style={{ color: 'white' }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={takePhoto}
                                    style={[bodyStyles.buttonCycled, bodyStyles.buttonCamera]}>
                                    <Ionicons name="camera" size={40} style={{ color: 'white' }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={toogleTorch}
                                    style={[bodyStyles.buttonCycled, { backgroundColor: torch ? 'orange' : 'rgba(17, 18, 25, 1)' }]}>
                                    <Ionicons name="flashlight" size={28} style={{ color: 'white' }} />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </>
            }
        </View>
    </View>
}

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#eee',
        fontSize: 20,
        fontWeight: 'normal'
    }
});

const bodyStyles = StyleSheet.create({
    container: {
        flex: 9,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        borderColor: "white"
    },
    containerCamera: {
        padding: 0,
        overflow: 'hidden',
        width: "100%",
        height: "80%",
        zIndex: 1
    },
    camera: {
        flex: 1
    },
    containerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: 144,
        zIndex: 1
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: 48,
        padding: 0,
        margin: 8
    },
    buttonCycled: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        borderRadius: 100,
        width: 60,
        height: 60,
        padding: 0,
        margin: 8
    },
    buttonCamera: {
        backgroundColor: 'rgba(255, 255, 255, .3)',
        width: 64,
        height: 64
    },
    buttonDark: {
        backgroundColor: 'rgba(17, 18, 25, 1)',
    },
    buttonDarkDisabled: {
        backgroundColor: 'rgba(17, 18, 25, .4)',
    },
    buttonDanger: {
        backgroundColor: 'rgba(143, 4, 1, .8)',
    },
    buttonDangerDisabled: {
        backgroundColor: 'rgba(143, 4, 1, .4)',
    },
    buttonPrimary: {
        backgroundColor: 'rgba(232, 0, 139, 1)'
    },
    buttonPrimaryDisabled: {
        backgroundColor: 'rgba(232, 0, 139, .2)'
    },
    buttonSecondary: {
        backgroundColor: 'rgba(56, 168, 197, 1)'
    },
    buttonSecondaryDisabled: {
        backgroundColor: 'rgba(46, 93, 105, .5)'
    },
    buttonSecondaryActive: {
        backgroundColor: 'rgba(73, 185, 214, 1)'
    },
    buttonIconWhite: {
        color: 'rgba(255, 255, 255, 1)'
    },
    buttonIconWhiteMutted: {
        color: 'rgba(255, 255, 255, .4)'
    },
    textButtonWhite: {
        color: '#eee'
    },
    textButtonMutted: {
        color: 'rgba(255, 255, 255, .5)'
    }
});



export default CapturePhotoView;