import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, Modal, Pressable, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenView from "../../components/ScreenView";
import { LoadingPicture, Image404 } from '../../assets/images';
import useSound from "../../hooks/useSound";
import { colors, gradients, textStyles } from "../../components/Styles";
import { Badge } from "../../components/FormComponents";
import { LinearGradient } from "expo-linear-gradient";
import useHeaderbar from '../../hooks/useHeaderbar';
import FullScreenImage from "../../components/FullScreenImage";
import InternalHeader from "../../components/InternalHeader";
import { useFocusEffect } from "@react-navigation/native";
import ConfigContext from "../../context/ConfigProvider";
import useAxios from "../../hooks/useAxios";
import AuthContext from "../../context/AuthProvider";

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
    const { code } = route.params;
    const { auth, setAuth }: any = useContext(AuthContext);
    const { config } : any = useContext(ConfigContext);
    const {instance} = useAxios(config.servers.app);

    const role = auth.data?.role;
    
    useHeaderbar({ hide: true, navigation });
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [refreshingMessage, setRefreshingMessage] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [serverPath, setServerPath] = useState<string>('');

    const sound = useSound();

    const getInformation = async (code: any) => {
        setErrorImage(false)
        setWait(true);
        const config = {
            headers: {
                origin: "https://inventorytool.upn164.edu.mx"
            }
        }
        instance.get(`/rows/${code}`, config).then(({ status, data }: any) => {
            if (status === 200) {
                setData(data.data);
            }
            setWait(false);
            setRefreshing(false);
        }).catch((err: any) => {
            sound.error()
            Alert.alert('Atención!', 'No se encontro el equipo, ¿Desea registrarlo?', [
                {
                    text: 'OK', onPress: () => navigation.replace('RegisterEquipment', { code })
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
            navigation.goBack();
        }
    }

    const handleVerifyImage = () => {
        setRefreshing(true);
        setRefreshingMessage('Verificando la información de la imagen');
        const uri = `/verify-image/` + data.picture;
        instance.get(uri).then(({ status, data }) => {
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
                        navigation.navigate('UploadPhoto', { code })
                        setWait(false);
                        setRefreshing(false);
                    }
                },
                {
                    text: 'Ignorar',
                    onPress: () => {
                        sound.touch()
                        setWait(false);
                        setRefreshing(false);
                    },
                    style: 'cancel',
                },
            ])
        })
    }

    const handleReplacePicture = () => {
        if(role === 'viewer'){
            return
        }
        sound.echo()
        Alert.alert('Confirmación!', '¿Deseas reemplazar la fotografía del equipo por una nueva?', [
            {
                text: 'Capturar', onPress: () => {
                    navigation.navigate('UploadPhoto', { code, picture: data.picture })
                    setWait(false);
                    setRefreshing(false);
                }
            },
            {
                text: 'Cancelar',
                onPress: () => {
                    sound.touch()
                    setWait(false);
                    setRefreshing(false);
                },
                style: 'cancel',
            },
        ])
    }

    const handleErrorImage = (props: any) => {
        setErrorImage(true)
        if(role === 'viewer'){
            return
        }
        Alert.alert('Atención!', 'No se pudo descargar la imagen del equipo, ¿Deseas verificar si existe en el sistema?', [
            {
                text: 'Verificar', onPress: handleVerifyImage
            },
            {
                text: 'Ignorar',
                onPress: () => {
                    sound.touch()
                    setWait(false);
                    setRefreshing(false);
                },
                style: 'cancel',
            },
        ])
    }

    const resetReviewState = (props: any) => {
        setRefreshing(true);
        setRefreshingMessage('Restaurando estado de revisión...');
        const uri = `/rows/restorereview/`+code;
        const config = {
            validateStatus: () => true
        }
        instance.post(uri, {}, config).then(({ status, data }) => {
            if (status === 200) {
                setData(data.data);
                alert("Restauración completada")
                onRefresh()
                return
            }
            alert("No se pudo procesar la restauración")
            setRefreshing(false);
        }).catch(err => {
            sound.error()
            alert("No se pudo completar la restauración del estado de revisión, verifique la información")
            onRefresh()
        })
    }

    const handleResetReviewState = (props: any) => {
        if(role === 'viewer'){
            return
        }
        sound.echo()
        Alert.alert('Atención!', '¿Deseas restaurar el estado de revisión del equipo?', [
            {
                text: 'Restaurar', onPress: resetReviewState
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

    const handleCloseFullscreenImage = () => {
        sound.back()
        setShowImage(false);
    }

    const handleGotoReview = () => {
        navigation.navigate('ReviewEquipment', { data })
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(!wait){
                handleBack();
            }
            return true;
        });
        return () => {
            backHandler.remove()
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            if(config.servers.app){
                const rootServer = (config.servers.app + '').split('/api/')
                if(rootServer && rootServer.length > 0){
                    setServerPath(rootServer[0])
                }
            }
            onRefresh()
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = useCallback(() => {
            setData(null)
            setRefreshing(true);
            setRefreshingMessage('Actualizando la información');
            getInformation(code);
            return
        
        
    }, []);

    const handleClone = () => {
        sound.drop()
        navigation.replace(
            "RegisterEquipment",
            {
                data
            }
        );
    }

    const currentStatus = (data?.status+"").toLowerCase();

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
                        image={`${serverPath}/pictures/full/${data.picture}`}
                        onBack={handleCloseFullscreenImage}
                        title={data.equipment_name}
                    />
            </Modal>
        }

        <InternalHeader title="Información del equipo" leftIcon="chevron-back" leftAction={handleBack} rightAction={(role === "admin" || role === "support") && handleClone} rightIcon={(role === "admin" || role === "support") && "copy"} rightIconstyle={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
        
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
                                                    backgroundColor: '#333',
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
                                            delayLongPress={1000}
                                            onLongPress={handleReplacePicture}
                                        >
                                            <Image
                                                source={{
                                                    uri: `${serverPath}/pictures/thumbs/${data.picture}`,
                                                    scale: 1
                                                }}
                                                resizeMethod="resize"
                                                resizeMode="cover"
                                                defaultSource={LoadingPicture}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    borderRadius: 100,
                                                    backgroundColor: '#333'
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
                                        <Badge background={currentStatus === "activo" || currentStatus === "bueno" ? "green" : 'red'} color="white" value={data.status}/>
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
                                    <Pressable delayLongPress={1000} onLongPress={handleResetReviewState}>
                                        <Badge background="green" color="white" size="md" style={{paddingHorizontal: 20}} value="Equipo revisado"/>
                                    </Pressable >
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
                                    <Badge background="red" color="white" size="md" style={{paddingHorizontal: 20, paddingVertical: 6}} onPress={role !== 'viewer' && handleGotoReview} value="Sin revisión" />
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
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center', textTransform: "uppercase"}]}>Departamento: {data.safeguard_apartment}</Text>
                                    <Text style={[colors.brown, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center', textTransform: "uppercase"}]}>Resguardante: {data.safeguard_person}</Text>
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
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.notes}</Text>
                                </View>
                            </View>

                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Registrado por:</Text>
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center',textTransform: "uppercase"}]}>{data.creator_name}</Text>
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.created_at}</Text>
                                </View>
                            </View>

                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                marginTop: 10,
                                paddingHorizontal: 20
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Text style={[colors.black, textStyles.md, {marginVertical: 2, marginBottom: 4}]}>Actualizado por:</Text>
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center', textTransform: "uppercase"}]}>{data.updater_name}</Text>
                                    <Text style={[colors.blue, textStyles.xs, textStyles.bold, {marginVertical: 2, textAlign: 'center'}]}>{data.updated_at}</Text>
                                </View>
                            </View>
                    </View>
                </ScreenView>
            </>
            :
            null
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