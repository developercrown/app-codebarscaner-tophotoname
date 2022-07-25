import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, Modal, RefreshControl, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native';
import axios from 'axios';
import useSound from '../../hooks/useSound';
import { LoadingPicture, Image404 } from '../../assets/images';
import ScreenView from '../../components/ScreenView';
import Navigator from '../../components/Navigator';
import { colors, textStyles } from '../../components/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GradientButton } from '../../components/FormComponents';
import useHeaderbar from '../../hooks/useHeaderbar';
import FullScreenImage from '../../components/FullScreenImage';

const EquipmentInformationView = (props: any) => {
    const { navigation, route } = props;
    const { code } = route.params;

    const sound = useSound();
    const [wait, setWait] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const serverURI = "https://api-inventario-minify.upn164.edu.mx";

    useHeaderbar({ hide: true, navigation });

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
                    text: 'OK', onPress: () => navigation.replace('RegisterEquipment', { code })
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        sound.touch()
                        navigation.goBack()
                    },
                    style: 'cancel',
                },
            ])

        });
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return wait;
        });

        getInformation(code);

        return () => backHandler.remove();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        getInformation(code);
    }, []);

    const handleErrorImage = (props: any) => {
        setErrorImage(true)
    }

    const handleCloseFullscreenImage = () => {
        sound.back()
        setShowImage(false);
    }

    return <View style={[styles.container]}>
        {
            data && data !== null ? <>
                {
                    refreshing && <View style={[styles.refreshView]}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={[
                            textStyles.alignCenter,
                            colors.white,
                            { paddingTop: 10 }
                        ]}>Actualizando la información</Text>
                    </View>
                }

                <Modal
                    animationType="fade"
                    statusBarTranslucent={true}
                    hardwareAccelerated={true}
                    transparent={false}
                    visible={showImage}
                    onRequestClose={() => {
                        handleCloseFullscreenImage()
                    }}
                >
                    <View style={[styles.fullScreenImageContainer, { width: windowWidth, height: windowHeight }]}>
                        <FullScreenImage
                            image={`${serverURI}/pictures/full/${data.picture}`}
                            onBack={handleCloseFullscreenImage}
                            title={'Prevista de fotografía'}
                        />
                    </View>
                </Modal>

                <ScreenView
                    style={[styles.container]}
                    styleContainer={styles.screenViewContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={wait}
                            onRefresh={onRefresh} />
                    }
                >
                    <View style={[styles.pictureContainer, { width: windowWidth }]}>
                        {
                            errorImage ? <Image
                                resizeMethod="resize"
                                resizeMode="stretch"
                                source={Image404}
                                style={[styles.picture, { width: "100%" }]}
                            />
                                :
                                <TouchableHighlight
                                    onPress={() => {
                                        sound.echo()
                                        setShowImage(true)
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: `${serverURI}/pictures/full/${data.picture}`,
                                            width: 400,
                                            height: 400,
                                            scale: 1
                                        }}
                                        resizeMethod="resize"
                                        resizeMode="cover"
                                        defaultSource={LoadingPicture}
                                        style={styles.picture}
                                        onError={handleErrorImage}
                                    />
                                </TouchableHighlight>
                        }
                    </View>
                    <View style={[styles.card, { width: windowWidth - 40 }]}>
                        <Text style={[
                            styles.textPadding,
                            textStyles.alignCenter,
                            textStyles.xl,
                            textStyles.bold
                        ]}>{data.codebar}</Text>
                        <Text style={[
                            { paddingTop: 10 },
                            styles.textPadding,
                            textStyles.alignCenter,
                            textStyles.sm
                        ]}>{data.equipment_name}</Text>

                        <Text style={[
                            { paddingTop: 6 },
                            styles.textPadding,
                            textStyles.alignCenter,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Estado Actual: </Text>{data.status}</Text>

                        {
                            data.review_status ?
                                <View style={[
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 10,
                                        flexDirection: 'row'
                                    }]}>
                                    <Ionicons name="checkmark" size={40} style={[colors.forestgreen]} />
                                    <Text
                                        style={[
                                            textStyles.sm,
                                            textStyles.bold,
                                            colors.forestgreen
                                        ]}>REVISADO</Text>
                                </View>
                                :
                                <View style={[{ alignItems: 'center', paddingVertical: 10 }]}>
                                    <GradientButton
                                        colors={
                                            [
                                                colors.firebrick.color,
                                                colors.firebrick.color
                                            ]
                                        }
                                        onTouch={() => navigation.navigate("EquipmentReview", { code })}
                                        style={{
                                            elevation: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Ionicons name="close" size={40} style={[colors.white]} />
                                        <Text
                                            style={[
                                                textStyles.sm,
                                                textStyles.bold,
                                                colors.white
                                            ]}>Sin Revisión Previa</Text>
                                    </GradientButton>
                                </View>
                        }

                    </View>
                    <View style={[styles.body, { width: windowWidth - 40 }]}>

                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Departamento Resguardante: </Text>{data.safeguard_apartment}</Text>
                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Responsable Resguardante: </Text>{data.safeguard_person}</Text>

                        <Text style={[
                            { paddingTop: 10 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Ubicación actual: </Text>{data.location ? data.location : 'No localizado'}</Text>
                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Marca: </Text>{data.trademark}</Text>
                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Modelo: </Text>{data.model}</Text>
                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Series: </Text>{data.series}</Text>
                        <Text style={[
                            { paddingTop: 2 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Notas Adicionales: </Text>{data.notes}</Text>


                        <Text style={[
                            { paddingTop: 10 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Fecha de registro: </Text>{data.created_at}</Text>
                        <Text style={[
                            { paddingTop: 10 },
                            styles.textPadding,
                            textStyles.alignLeft,
                            textStyles.sm
                        ]}><Text style={textStyles.bold}>Ultima Actualización: </Text>{data.updated_at}</Text>
                    </View>
                </ScreenView>
                <Navigator navigation={navigation} />
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
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    screenViewContainer: {
        paddingVertical: 0,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
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
    pictureContainer: {
        overflow: 'hidden',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        minHeight: 100,
        maxHeight: 300,
        elevation: 1,
        zIndex: 1
    },
    picture: {

    },
    card: {
        borderColor: 'rgba(255, 255, 255, .05)',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, .95)',
        borderRadius: 10,
        minHeight: 140,
        elevation: 2,
        padding: 10,
        top: -20,
        zIndex: 4
    },
    body: {
        backgroundColor: 'rgba(255, 255, 255, .95)',
        padding: 10,
        borderRadius: 10
    },
    textPadding: {
        paddingHorizontal: 16
    },
    fullScreenImageContainer: {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0
    },
    pictureFullscreen: {
        width: '100%',
        height: '100%',
    }
});

export default EquipmentInformationView;