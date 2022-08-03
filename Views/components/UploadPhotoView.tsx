import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity, Modal, Alert, Platform, ActivityIndicator, BackHandler, StatusBar } from 'react-native';
import ScreenView from '../../components/ScreenView';
import { background, colors, textStyles } from '../../components/Styles';
import useHeaderbar from '../../hooks/useHeaderbar';

import { Image404 } from '../../assets/images';
import useSound from '../../hooks/useSound';
import Ionicons from '@expo/vector-icons/Ionicons';
import CameraPhotoCapturer from '../../components/CameraPhotoCapturer';
import FullScreenImage from '../../components/FullScreenImage';
import InternalHeader from '../../components/InternalHeader';
import useAxios from '../../hooks/useAxios';
import ConfigContext from '../../context/ConfigProvider';
import { useFocusEffect } from '@react-navigation/native';

const UploadPhotoView = (props: any) => {
    const { navigation, route } = props;
    const { code, picture, sourcePath } = route.params;

    const { config } : any = useContext(ConfigContext);
    const {instance} = useAxios(config.servers.app)
    const [serverPath, setServerPath] = useState<string>('');

    const [photo, setPhoto] = useState<any>(null);
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [takePhotoMode, setTakePhotoMode] = useState<boolean>(false);
    const [processMode, setProcessMode] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    const [uploadProgres, setUploadProgres] = useState<number>(0);

    const sound = useSound();

    useHeaderbar({
        hide: true, navigation
    });

    useEffect(() => {
        const backAction = () => {
            if(!processMode){
                handleBack()
                return true;
            }
            
            sound.deny();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => {
            backHandler.remove();
        }
    })

    const disableAllFullscreenElements = () => {
        setViewPhotoMode(false)
        setTakePhotoMode(false)
    }

    const handlePhotoTaken = (photo: any) => {
        setPhoto(photo);
        disableAllFullscreenElements()
    }


    const uploadImage = async () => {
        return new Promise((resolve, reject) => {
            let payload = new FormData();
            let uriParts = photo.uri.split('.');
            let fileType = uriParts[uriParts.length - 1];
            const dataImage: any = {
                uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
                name: `app-image.${fileType}`,
                type: `image/${fileType}`,
            };
            payload.append('photo', dataImage);
            setUploadProgres(0);
            const uri = '/rows/photo/'+code;
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (event: any) => {
                    setUploadProgres(Math.round((100 * event.loaded) / event.total))
                },
                validateStatus: () => true
            }
            instance.post(uri, payload, config).then((response: any) => {
                const { data, status } = response
                if (status == 200) {
                    resolve({data, status})
                } else {
                    reject({data, status})
                }
            }).catch((err: any) => {
                reject({data: err})
            })
        })
    }

    const upload = () => {
        setProcessMode(true)
        setTimeout(() => {
            setStep(1)
            uploadImage().then(()=>{
                setProcessMode(false)
                sound.success();
                Alert.alert('Exito!', 'Se ha almacenado correctamente la fotografía y asignado al equipo', [
                    {
                        text: 'Continuar', onPress: () => {
                            sound.touch()
                            handleBack()
                        },
                    }
                ]);
            }).catch((err)=>{
                sound.deny();
                if(err!.status){
                    switch(err.status){
                        case 400: 
                            Alert.alert('Proceso denegado', 'La información ingresada es incorrecta o fue recibida en el servidor incompleta, intentelo nuevamente');
                            break
                        case 404: 
                            Alert.alert('Proceso denegado', 'el código que ingreso no fue identificado en el sistema');
                            break
                        default:
                            Alert.alert('Error', 'Ocurrio un error al registrar la información')
                    }
                }
                setProcessMode(false)
            });
        }, 250);
    }

    const save = () => {
        sound.touch()
        if(photo){
            sound.notification();
            Alert.alert(
                'Confirmación!',
                '¿Esta seguro de continuar la asignación de la fotografía al equipo?',
                [
                    {
                        text: 'Continuar', onPress: () => {
                            sound.touch();
                            upload()
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => {
                            sound.touch()
                        },
                        style: 'cancel',
                    },
                ]
            )
            return
        }
        Alert.alert('Atención', 'Es necesario que captures la fotografía del equipo antes de cargarla en el sistema')
        sound.notification()
    }

    const handleBack = () => {
        if(!processMode) {
            sound.back();
            navigation.navigate(sourcePath, {code});
        }
    }

    useFocusEffect(
        useCallback(() => {
            if(config.servers.app){
                const rootServer = (config.servers.app + '').split('/api/')
                if(rootServer && rootServer.length > 0){
                    setServerPath(rootServer[0])
                }
            }
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(!processMode) {
                handleBack();
            }
            return true;
        });
        return () => {
            backHandler.remove()
        };
    }, []);

    const header = <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        {
            !processMode && <InternalHeader title={picture ? "Reemplazo de fotografía" : "Captura de fotografía"} leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
        }
    </>

    if(processMode){
        return <View style={[styles.container]}>
                { header }
                <ScreenView
                    style={[styles.container]}
                    styleContainer={styles.screenViewContainer}
                >
                    <View style={{
                        backgroundColor: 'white',
                        flex: 1,
                        marginTop: 40,
                        width: 350,
                        height: 350,
                        borderRadius: 175,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 2
                    }}>
                        <ActivityIndicator size="large" color="green" style={{marginVertical: 20, transform: [{scale: 1.6}]}}/>

                        {
                            step === 0 && <View style={{marginVertical: 20, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[textStyles.sm, textStyles.bold, colors.black]}>Procesando la información...</Text>
                            </View>
                        }

                        {
                            step === 1 && <View style={{marginVertical: 20, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[textStyles.md, textStyles.bold, colors.black]}>Subiendo Fotografía</Text>
                                <Text style={[textStyles.md, textStyles.bold, colors.black]}>{uploadProgres} %</Text>
                            </View>
                        }
                    </View>
                </ScreenView>
        </View>; 
    }

    return <View style={[styles.container]}>
        { header }
        {
            !viewPhotoMode && takePhotoMode &&  <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={takePhotoMode}
                onRequestClose={disableAllFullscreenElements}
            > 
                <CameraPhotoCapturer
                    base64
                    handleBack={disableAllFullscreenElements}
                    handleSuccess={handlePhotoTaken}/>
            </Modal>
        }
        {
            !takePhotoMode && viewPhotoMode &&  <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={viewPhotoMode}
                onRequestClose={disableAllFullscreenElements}
            > 
                <FullScreenImage image={photo} onBack={()=> setViewPhotoMode(false)}/>
            </Modal>
        }
        <ScreenView
            style={[styles.container]}
            styleContainer={styles.screenViewContainer}
        >
            <View style={[styles.photoCardComponent]}>
                {
                    photo ? <TouchableHighlight
                        onPress={() => {
                            sound.echo()
                            setViewPhotoMode(true)
                        }}
                    >
                        <View style={[{
                            width: '100%',
                            height: '100%'
                        }]}>
                            <Image
                                source={{ uri: photo && photo.uri }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#333',
                                }}
                            />
                        </View>
                    </TouchableHighlight>
                        :
                        picture ? <Image
                        source={{ uri: `${serverPath}/pictures/full/${picture}` }}
                        style={{
                            flex: 1,
                            backgroundColor: '#333',
                        }}
                    />
                        :
                        <Image
                                resizeMethod="resize"
                                resizeMode="stretch"
                                source={Image404}
                                style={[{ width: "100%", backgroundColor: '#333' }]}
                            />
                        

                }
            </View>
            <TouchableOpacity
                onPress={() => {
                    sound.echo()
                    setTakePhotoMode(true)
                }}
                style={styles.takePhotoButton}
            >
                <Ionicons name="camera" size={24} style={[colors.dark]} />
            </TouchableOpacity>
            <View style={[styles.codebarContainer, styles.cardStyle]}>
                <View style={[{ flexDirection: 'row', alignItems: 'center', }]}>
                    <Ionicons name="qr-code" size={24} style={[colors.black, { marginRight: 8 }]} />
                    <Text style={[textStyles.md]}>Código del equipo:</Text>
                </View>
                <Text style={[textStyles.md, textStyles.bold]}>{code}</Text>
            </View>

            <View style={[styles.controls]}>
                <TouchableOpacity
                    onPress={save}
                    style={[styles.button, background.orange]}>
                    <Text style={[{ color: 'white', marginRight: 10 }, textStyles.shadowLight]}>Registrar Revisión</Text>
                    <Ionicons name="cloud-upload" size={28} style={[{ color: 'white' }, textStyles.shadowLight]} />
                </TouchableOpacity>
            </View>
        </ScreenView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    screenViewContainer: {
        padding: 0,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
    },
    cardStyle: {
        backgroundColor: 'rgba(250, 250, 250, 1)',
        padding: 20,
        marginVertical: 4,
        borderRadius: 4,
        elevation: 2
    },
    codebarContainer: {
        width: '80%',
        minHeight: 40,
        padding: 10,
        paddingLeft: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        top: -32
    },
    photoCardComponent: {
        backgroundColor: 'black',
        width: '100%',
        height: 240,
        padding: 0,
        margin: 0,
        top: -10,
        borderBottomLeftRadius: 200,
        borderBottomRightRadius: 200,
        overflow: 'hidden',
        justifyContent: 'center',
        elevation: 1
    },
    takePhotoButton: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        position: 'relative',
        top: -40,
        elevation: 4
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        width: 'auto',
        backgroundColor: 'black',
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1
    }
});

export default UploadPhotoView;