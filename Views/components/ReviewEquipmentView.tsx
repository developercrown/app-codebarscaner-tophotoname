import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, Modal, Platform, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import ScreenView from "../../components/ScreenView";
import { LoadingPicture, Image404 } from '../../assets/images';
import useSound from "../../hooks/useSound";
import { colors, fontStyles, gradients, textStyles } from "../../components/Styles";
import Constants from 'expo-constants';
import { Badge, FormContainer, Select, TextArea } from "../../components/FormComponents";
import { LinearGradient } from "expo-linear-gradient";
import InternalHeader from "../../components/InternalHeader";
import { estadosEquipo, locations } from "../../components/Constants";
import FullScreenImage from "../../components/FullScreenImage";
import axios, { AxiosError } from "axios";
import useHeaderbar from "../../hooks/useHeaderbar";

const CardBlock = (props: any) => {
    const { collapsed, hiddable, title } = props;
    const [show, setShow] = useState<boolean>(collapsed == true ? false : true);
    const sound = useSound();
    const toggle = () => {
        sound.toggle()
        setShow(!show)
    }
    return <View style={[{
        height: show || !hiddable ? 'auto' : 50,
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2
    }, props.style]}>
        <View style={{
            height: 40,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%'
        }}>
            <Text style={[
                colors.black,
                textStyles.md,
                textStyles.alignCenter,
                fontStyles.nunitoBold,
                {
                    marginBottom: 10
                }
            ]}>{title}</Text>

            {
                hiddable && <TouchableOpacity onPress={toggle}>
                    <Text style={[
                        colors.blue,
                        textStyles.xs,
                        textStyles.alignCenter,
                        fontStyles.nunitoSemiBold,
                        {
                            marginBottom: 10
                        }
                    ]}>{show ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
            }

        </View>
        {props.children}
    </View>
}

const ReviewDataRow = (props: any) => {
    const { background, color, label, value } = props;
    return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginVertical: 2, paddingLeft: 10 }}>
        <Text style={[colors.dark, textStyles.sm, fontStyles.nunito, { marginRight: 6 }]}>{label}:</Text>
        <Badge background={background ? background : "transparent"} color={color ? color : "black"} style={fontStyles.nunitoBold} value={value} />
    </View>
}

const ReviewEquipmentView = (props: any) => {
    const { navigation, route } = props;
    const { data, sourcePath } = route.params;

    const {
        codebar,
        equipment_name,
        location,
        notes,
        model,
        trademark,
        review_status,
        picture,
        safeguard_apartment,
        safeguard_person,
        series,
        status
    } = data

    const serverURI = "https://api-inventario-minify.upn164.edu.mx";
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);

    const [notesValue, setNotesValue] = useState<any>(notes ? notes : 'Sin notas');
    const [locationValue, setLocationValue] = useState<any>(location ? location : 'DESCONOCIDO');
    const [statusEquipment, setStatusEquipment] = useState<any>(status ? status : 'ACTIVO');

    const sound = useSound();

    useHeaderbar({ hide: true, navigation });

    const handleErrorImage = (props: any) => {
        setErrorImage(true)
    }

    const handleBack = () => {
        if(!wait) {
            sound.back();
            navigation.replace(sourcePath, {code: codebar});
        }
    }

    const handleCloseFullscreenImage = () => {
        sound.back()
        setShowImage(false);
    }

    const sendReview = (payload: any) => {
        return new Promise((resolve, reject) => {
            const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/' + data.codebar;
            axios({
                method: 'put',
                url: uri,
                data: payload,
                validateStatus: () => true
            }).then(({ status, data }) => {
                if (status == 200) {
                    resolve({data, status})
                } else {
                    reject({data, status})
                }
            }).catch((reasonError: AxiosError) => {                
                reject({data: reasonError})
            });
        })
    }

    const storeReview = () => {
        if(!wait){
            Alert.alert('Confirmación', '¿Estas seguro de realizar este proceso?, esta acción no se puede revertir', [
                {
                    text: 'Cancelar',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'Continuar',
                    onPress: () => {
                        const payload = {
                            notes: notesValue,
                            location: locationValue,
                            status: statusEquipment
                        }
                        
                        setWait(true)
                        
                        sendReview(payload).then(()=>{
                            alert("Registrado correctamente")
                            setTimeout(() => {
                                sound.success();
                                handleBack();
                            }, 400);
                        }).catch((err)=>{
                            sound.deny();
                            if(err!.status){
                                switch(err.status){
                                    case 400: 
                                        Alert.alert('Proceso denegado', 'La información ingresada es incorrecta o fue recibida en el servidor incompleta, intentelo nuevamente');
                                        break
                                    case 409: 
                                        Alert.alert('Proceso denegado', 'el código que intenta ingresar ya fue revisado previamente en el sistema');
                                        break
                                    default:
                                        Alert.alert('Error', 'Ocurrio un error al registrar la información')
                                }
                            }
                            setWait(false)
                        });
                        
                    }
                },
            ]);
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleBack()
            return true;
        });

        return () => backHandler.remove();
    });

    return <View style={[styles.container, { paddingTop: 0 }]}>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)' />
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
                    image={`${serverURI}/pictures/full/${picture}`}
                    onBack={handleCloseFullscreenImage}
                    title={equipment_name}
                />
            </Modal>
        }
        <FormContainer>
            <ScreenView
                style={[styles.container]}
                styleContainer={styles.screenViewContainer}
            >
                <InternalHeader title="Revisión del Equipo" leftAction={handleBack} leftIcon="chevron-back" light style={{ backgroundColor: '#e5eef8', opacity: !wait ? 1 : 0}} />

                <View style={[styles.topContainer, {elevation: !wait ? 2 : 0}]}>
                    {
                        errorImage ? <Image
                            resizeMethod="resize"
                            resizeMode="stretch"
                            source={Image404}
                            style={[]}
                        />
                            :
                            !wait ? <>
                                <TouchableHighlight
                                    onPress={() => {
                                        sound.echo()
                                        setShowImage(true)
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: `${serverURI}/pictures/full/${picture}`,
                                            scale: 1
                                        }}
                                        resizeMethod="scale"
                                        resizeMode="cover"
                                        defaultSource={LoadingPicture}
                                        style={{
                                            width: 400,
                                            height: 300,
                                            borderRadius: 0
                                        }}
                                        onError={handleErrorImage}
                                    />
                                </TouchableHighlight>
                            </>
                            :
                            <>
                                <Image
                                    source={{
                                        uri: `${serverURI}/pictures/full/${picture}`,
                                        scale: 1
                                    }}
                                    resizeMethod="scale"
                                    resizeMode="cover"
                                    defaultSource={LoadingPicture}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 100
                                    }}
                                    onError={handleErrorImage}
                                />
                            </>
                    }

                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 10 }}>

                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 6 }}>
                        {
                            !wait && <Text style={[
                                colors.black,
                                textStyles.md,
                                textStyles.alignLeft,
                                fontStyles.nunitoSemiBold
                            ]}>Nombre del equipo</Text>
                        }
                        <Text style={[
                            colors.dark,
                            textStyles.md,
                            textStyles.alignLeft,
                            !wait ? fontStyles.nunito : fontStyles.nunitoBold
                        ]}>{equipment_name}</Text>
                    </View>

                    {
                        
                        !wait ? <>
                        <CardBlock collapsed hiddable title="Resumen General">
                            <ReviewDataRow background={(status + "").toLowerCase() === 'activo' ? 'green' : 'red'} color="white" label="Estado actual del equipo" value={status} />
                            <ReviewDataRow color="rgba(4, 100, 236, 1)" label="Código" value={codebar} />
                            <ReviewDataRow color="rgba(4, 100, 236, 1)" label="Marca" value={trademark} />
                            <ReviewDataRow color="rgba(4, 100, 236, 1)" label="Modelo" value={model} />
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', marginVertical: 2, paddingLeft: 10 }}>
                                <Text style={[colors.dark, textStyles.sm, fontStyles.nunito, { marginRight: 0 }]}>Series o Códigos:</Text>
                                <Text style={[
                                    {
                                        backgroundColor: "transparent",
                                        paddingHorizontal: 0,
                                        marginVertical: 2,
                                        textAlign: 'center',
                                        color: "rgba(4, 100, 236, 1)",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%'
                                    },
                                    fontStyles.nunitoBold
                                ]}>{series}</Text>
                            </View>
                        </CardBlock>

                        <CardBlock collapsed title="Datos del resguardo">
                            <Text style={[colors.dark, textStyles.xs, textStyles.bold, { marginVertical: 2, textAlign: 'center' }]}>Departamento: {safeguard_apartment}</Text>
                            <Text style={[colors.dark, textStyles.xs, textStyles.bold, { marginVertical: 2, textAlign: 'center' }]}>Resguardante: {safeguard_person}</Text>
                            
                            <Select
                                label="Ubicación Actual"
                                title="Ubicaciones registradas"
                                items={locations}
                                onChange={setLocationValue}
                                styleLabel={[
                                    colors.dark,
                                    textStyles.sm,
                                    fontStyles.nunito,
                                    { marginRight: 0 }]}

                                style={[fontStyles.nunitoBold]}
                                value={locationValue}
                            />

                            <Select
                                label="Estado Actual"
                                title="Selecciona el estado"
                                items={estadosEquipo}
                                onChange={setStatusEquipment}
                                styleLabel={[
                                    colors.dark,
                                    textStyles.sm,
                                    fontStyles.nunito,
                                    { marginRight: 0 }]}

                                style={[fontStyles.nunitoBold]}
                                value={statusEquipment}
                            />

                        </CardBlock>


                        <TextArea
                            label="Notas adicionales"
                            placeholder="Ingresa los detalles adicionales, notas de resguardo o estado del equipo"
                            styleInput={[{ backgroundColor: 'rgba(244, 244, 244, 1)', borderRadius: 4 }]}
                            styleLabel={[textStyles.sm, fontStyles.nunitoBold, colors.black]}
                            styleContainer={{ marginVertical: 10 }}
                            onChange={setNotesValue}
                            value={notesValue}
                        />


                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            marginTop: 20
                        }}>
                            <TouchableOpacity
                                onPress={storeReview}
                                style={[
                                    {
                                        backgroundColor: 'green',
                                        flexDirection: 'row',
                                        width: "auto",
                                        height: 40,
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        borderRadius: 4
                                    }
                                ]}>
                                <Text style={{ color: 'white' }}>Registrar Revisión</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <ActivityIndicator size="large" color="rgba(4, 100, 236, 1)" style={{marginTop: 40, transform: [{scale: 1.6}]}}/>
                        <Text style={[{ color: 'rgba(4, 100, 236, 1)', marginTop: 10 }, fontStyles.nunitoBold]}>Procesando su revisión</Text>
                    </>
                    }

                </View>
            </ScreenView>
        </FormContainer>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(229, 238, 248, .95)',
    },
    screenViewContainer: {
        paddingVertical: 0,
        paddingBottom: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
    },
    topContainer: {
        width: '90%',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden'
    }
});

export default ReviewEquipmentView;