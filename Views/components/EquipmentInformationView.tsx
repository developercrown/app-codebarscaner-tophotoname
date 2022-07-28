import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, Modal, RefreshControl, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

import ScreenView from "../../components/ScreenView";
import { LoadingPicture, Image404 } from '../../assets/images';
import useSound from "../../hooks/useSound";
import { colors, gradients, positionStyles, textStyles } from "../../components/Styles";
import Constants from 'expo-constants';
import { Badge, IconButton } from "../../components/FormComponents";
import { LinearGradient } from "expo-linear-gradient";
import useHeaderbar from '../../hooks/useHeaderbar';
import FullScreenImage from "../../components/FullScreenImage";
import ReviewEquipmentView from "./ReviewEquipmentView";
import InternalHeader from "../../components/InternalHeader";
import { useFocusEffect } from "@react-navigation/native";

const serverURI = "https://api-inventario-minify.upn164.edu.mx";

const ItemRight = (props: any) => {
    const {background, label, value} = props;
    const bg: string = background ? background : 'orange';
    const gradient: any = gradients[bg];
    return <LinearGradient
        colors={gradient.array}
        start={gradient.start}
        end={gradient.end}
        style={{
            alignItems: 'flex-end',
            paddingEnd: 20,
            paddingVertical: 10,
            borderBottomLeftRadius: 100,
            borderTopLeftRadius: 100,
            elevation: 2,
            marginVertical: 4
        }}
    >
        <Text style={[colors.white, textStyles.sm, textStyles.shadowLight, {marginVertical: 2}]}>{label}:</Text>
        <Text style={[colors.white, textStyles.sm, textStyles.bold, textStyles.shadowLight, {marginVertical: 2}]}>{value}</Text>
    </LinearGradient>
}

const EquipmentInformationView = (props: any) => {
    const { navigation, route } = props;
    const { code, sourcePath } = route.params;
    
    useHeaderbar({ hide: true, navigation });
    const serverURI = "https://api-inventario-minify.upn164.edu.mx";
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [refreshingMessage, setRefreshingMessage] = useState<string>('');
    const [reviewMode, setReviewMode] = useState<boolean>()

    const [data, setData] = useState<any>(null);

    const sound = useSound();

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const getInformation = async (code: any) => {
        setErrorImage(false)
        setWait(true);
        const uri = `${serverURI}/api/v1/rows/` + code;
        axios({
            method: 'get',
            url: uri,
        }).then(({ status, data }) => {
            if (status === 200) {
                setData(data.data);
            }
            setWait(false);
            setRefreshing(false);
        }).catch(err => {
            sound.error()
            Alert.alert('Atención!', 'No se encontro el equipo, ¿Desea registrarlo?', [
                {
                    text: 'OK', onPress: () => navigation.replace('RegisterEquipment', { code, sourcePath: 'EquipmentInformation' })
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        handleBack()
                    },
                    style: 'cancel',
                },
            ])
        });
    }

    const handleBack = () => {
        if(!wait) {
            sound.back();
            navigation.replace('CodebarReader', {code});
        }
    }

    const handleVerifyImage = () => {
        setRefreshing(true);
        setRefreshingMessage('Verificando la información de la imagen');
        const uri = `${serverURI}/verify-image/` + data.picture;
        axios({
            method: 'get',
            url: uri,
        }).then(({ status, data }) => {
            console.log('data', data);
            
            if (status === 200) {
                setData(data.data);
            }
            alert("La imagen si existe en el servidor, intentar recargar la información")
            setWait(false);
            setRefreshing(false);
        }).catch(err => {
            sound.error()
            Alert.alert('Atención!', 'No se encontro la imagen en el servidor, ¿Desea capturarla?', [
                {
                    text: 'Capturar', onPress: () => {
                        navigation.navigate('UploadPhoto', { code, sourcePath: 'EquipmentInformation' })
                        setWait(false);
                        setRefreshing(false);
                    }
                },
                {
                    text: 'Ignorar',
                    onPress: () => {
                        sound.touch()
                    },
                    style: 'cancel',
                },
            ])
        });
    }

    const handleReplacePicture = () => {
        Alert.alert('Confirmación!', '¿Deseas reemplazar la fotografía del equipo por una nueva?', [
            {
                text: 'Capturar', onPress: () => {
                    navigation.navigate('UploadPhoto', { code, picture: data.picture, sourcePath: 'EquipmentInformation' })
                    setWait(false);
                    setRefreshing(false);
                }
            },
            {
                text: 'Cancelar',
                onPress: () => {
                    sound.touch()
                },
                style: 'cancel',
            },
        ])
    }

    const handleErrorImage = (props: any) => {
        setErrorImage(true)
        Alert.alert('Atención!', 'No se pudo descargar la imagen del equipo, ¿Deseas verificar si existe en el sistema?', [
            {
                text: 'Verificar', onPress: handleVerifyImage
            },
            {
                text: 'Ignorar',
                onPress: () => {
                    sound.touch()
                },
                style: 'cancel',
            },
        ])
    }

    const handleCloseFullscreenImage = () => {
        sound.back()
        setShowImage(false);
    }

    const handleReviewOnSuccess = () => {
        setReviewMode(false)
        onRefresh()
    }

    const handleGotoReview = () => {
        navigation.navigate('ReviewEquipment', { data, sourcePath: 'EquipmentInformation' })
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(!wait){
                handleBack();
            }
            return true;
        });

        getInformation(code);
        setRefreshingMessage('Cargando la información');

        return () => {
            backHandler.remove()
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            onRefresh()
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshingMessage('Actualizando la información');
        getInformation(code);
    }, []);

    return <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>

        {
            refreshing && <View style={[styles.refreshView]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    { paddingTop: 10 }
                ]}>{refreshingMessage}</Text>
            </View>
        }

        {
            showImage && <Modal
                animationType="fade"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={true}
                visible={showImage}
                onRequestClose={handleCloseFullscreenImage}
            >
                <FullScreenImage
                        image={`${serverURI}/pictures/full/${data.picture}`}
                        onBack={handleCloseFullscreenImage}
                        title={data.equipment_name}
                    />
            </Modal>
        }

        <InternalHeader title="Información del equipo" leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
        
        {
            data && data != null ? <>
                <ScreenView
                    style={[styles.container]}
                    styleContainer={styles.screenViewContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={wait}
                            onRefresh={onRefresh} />
                    }
                >
                    <View style={[styles.topContainer, { minHeight: 400, paddingBottom: 20}]}>
                        
                        <Text style={[
                            colors.white,
                            textStyles.md,
                            {
                                marginTop: 20,
                                marginBottom: 24,
                                width: '100%',
                                textAlign: 'center',
                            }
                        ]}>{data.equipment_name}</Text>
                    
                        <View style={{
                            width: '100%',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                flex: 1.4,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {
                                    errorImage ? <Image
                                                source={Image404}
                                                resizeMethod="resize"
                                                resizeMode="cover"
                                                defaultSource={LoadingPicture}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    borderRadius: 100
                                                }}
                                                onError={handleErrorImage}
                                            />
                                        :
                                        <TouchableOpacity
                                            onPress={() => {
                                                sound.echo()
                                                setShowImage(true)
                                            }}
                                            delayLongPress={2000}
                                            onLongPress={handleReplacePicture}
                                        >
                                            <Image
                                                source={{
                                                    uri: `${serverURI}/pictures/full/${data.picture}`,
                                                    scale: 1
                                                }}
                                                resizeMethod="resize"
                                                resizeMode="cover"
                                                defaultSource={LoadingPicture}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    borderRadius: 100
                                                }}
                                                onError={handleErrorImage}
                                            />
                                        </TouchableOpacity>
                                }
                                <View style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    paddingHorizontal: 20
                                }}>
                                    <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Text style={[colors.white, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Estado Actual:</Text>
                                        <Badge background={(data.status+"").toLowerCase() === "activo" ? "green" : 'red'} color="white" value={data.status}/>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 1
                            }}>
                                <ItemRight background="orange" label='Código' value={data.codebar}/>
                                <ItemRight background="red" label='Marca' value={data.trademark}/>
                                <ItemRight background="blue" label='Modelo' value={data.model}/>
                            </View>
                            
                        </View>

                        {
                            data.review_status ? <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 20,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Badge background="green" color="white" size="md" style={{paddingHorizontal: 20}} value="Equipo revisado"/>
                                </View>
                            </View>
                            :
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 20,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Badge background="red" color="white" size="md" style={{paddingHorizontal: 20, paddingVertical: 6}} onPress={handleGotoReview} value="Sin revisión" />
                                </View>
                            </View>
                        }

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            marginTop: 10,
                            paddingHorizontal: 20
                        }}>
                            <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Text style={[colors.white, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Series o Códigos:</Text>
                                <Text style={[colors.white, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.series}</Text>
                            </View>
                        </View>
                        
                    </View>
                    
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, .9)',
                        width: '95%',
                        marginTop: 20,
                        borderRadius: 10,
                        paddingVertical: 20
                    }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.bold, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Datos del resguardo:</Text>
                                    <Text style={[colors.black, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>Departamento: {data.safeguard_apartment}</Text>
                                    <Text style={[colors.black, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>Resguardante: {data.safeguard_person}</Text>
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Ubicación Actual:</Text>
                                    <Badge background={'blue'} color="white" size="md" style={{paddingHorizontal: 20, paddingVertical: 4}} value={data.location ? data.location : 'No localizado'}/>
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Notas adicionales:</Text>
                                    <Text style={[colors.black, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.notes}</Text>
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Fecha de registro:</Text>
                                    <Text style={[colors.black, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.created_at}</Text>
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Fecha de actualización:</Text>
                                    <Text style={[colors.black, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.updated_at}</Text>
                                </View>
                            </View>
                    </View>
                </ScreenView>
            </>
            :
            <View style={[styles.container, {
                width: windowWidth,
                height: windowHeight,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    { paddingTop: 10 }
                ]}>Cargando la información...</Text>
            </View>
        }

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    fullScreenImageContainer: {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0
    },
    screenViewContainer: {
        paddingVertical: 0,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
    },
    topContainer: {
        backgroundColor: 'rgba(10, 10, 10, .8)',
        // backgroundColor: 'rgba(20, 30, 80, .9)',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomEndRadius: 40,
        borderBottomStartRadius: 40
    },
    refreshView: {
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

export default EquipmentInformationView;