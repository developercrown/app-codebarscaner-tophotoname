import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity, Modal, Alert, Platform, ActivityIndicator, BackHandler, StatusBar } from 'react-native';
import ScreenView from '../../components/ScreenView';
import { background, colors, textStyles } from '../../components/Styles';
import useHeaderbar from '../../hooks/useHeaderbar';
import { AxiosError } from 'axios';

import { Image404 } from '../../assets/images';
import useSound from '../../hooks/useSound';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input, Select, TextArea } from '../../components/FormComponents';

import CameraPhotoCapturer from '../../components/CameraPhotoCapturer';
import FullScreenImage from '../../components/FullScreenImage';
import CodebarReader from '../../components/CodebarReader';
import InternalHeader from '../../components/InternalHeader';
import ConfigContext from '../../context/ConfigProvider';
import useAxios from '../../hooks/useAxios';
import useValidate from '../../hooks/useValidate';


const RegisterEquipmentView = (props: any) => {
    const [dbConfig, setDbConfig] = useState<any>(null);

    const { config } : any = useContext(ConfigContext);
    const {instance} = useAxios(config.servers.app);

    const {required} = useValidate()

    const { navigation, route } = props;
    const { code } = route.params;
    const [photo, setPhoto] = useState<any>(null);
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [takePhotoMode, setTakePhotoMode] = useState<boolean>(false);
    const [readCodebarsMode, setReadCodebarsMode] = useState<boolean>(false);
    const [processMode, setProcessMode] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    const [uploadProgres, setUploadProgres] = useState<number>(0);

    // Form data states
    const [name, setName] = useState('');
    const [series, setSeries] = useState('');
    const [trademark, setTrademark] = useState('');
    const [model, setModel] = useState('');
    const [status, setStatus] = useState('ACTIVO');
    const [safeguardApartment, setSafeguardApartment] = useState('Desconocido');
    const [safeguardPerson, setSafeguardPerson] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('Desconocido');

    // Form References

    const equipmentNameRef = useRef<any>();
    const equipmentTrademarkRef = useRef<any>();
    const equipmentModelRef = useRef<any>();
    const equipmentSeriesRef = useRef<any>();

    const sound = useSound();

    useHeaderbar({
        hide: true, navigation
    });

    useEffect(() => {
        const backAction = () => {
            handleBack()
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    })

    useEffect(() => {
        if(config && config.status){
            setDbConfig(config.data)
        }
    },  [dbConfig])

    const handleBack = () => {
        if(!processMode) {
            sound.back();
            navigation.replace('CodebarReader', {code});
            return
        }
        sound.deny();
    }

    const disableAllFullscreenElements = () => {
        setTakePhotoMode(false)
        setViewPhotoMode(false)
        setReadCodebarsMode(false)
    }

    const handlePhotoTaken = (photo: any) => {
        setPhoto(photo);
        disableAllFullscreenElements()
    }

    const handleCodebarReaded = (code: string) => {
        code = code.trim()
        const value = series === '' ? code : series + ' - ' + code;
        setSeries(value.trim())
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
                    // console.log('sub-err', response);
                    reject({data, status})
                }
            }).catch((err: any) => {
                console.log('err', err);
                reject({data: err})
            });
        })
    }

    const saveRow = (payload: any) => {
        return new Promise((resolve, reject) => {
            const uri = '/rows/';
            const config = {
                validateStatus: () => true
            }
            instance.post(uri, payload, config).then(({ status, data }) => {
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

    const saveQueue = (payload: any) => {
        setProcessMode(true)
        setTimeout(() => {
            setStep(1)
            saveRow(payload).then(()=>{
                setStep(2)
                uploadImage().then(()=>{
                    setProcessMode(false)
                    sound.success();
                    Alert.alert('Exito!', 'Se ha registrado correctamente el equipo', [
                        {
                            text: 'Continuar', onPress: () => {
                                sound.touch()
                                navigation.replace(
                                    "EquipmentInformation",
                                    { code }
                                );
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
            }).catch((err)=>{
                sound.deny();
                if(err!.status){
                    switch(err.status){
                        case 400: 
                            Alert.alert('Proceso denegado', 'La información ingresada es incorrecta o fue recibida en el servidor incompleta, intentelo nuevamente');
                            break
                        case 409: 
                            Alert.alert('Proceso denegado', 'el código que intenta ingresar ya existe previamente en el sistema');
                            break
                        default:
                            Alert.alert('Error', 'Ocurrio un error al registrar la información')
                    }
                }
                setProcessMode(false)
            })
        }, 250);
    }

    const save = () => {
        sound.touch()
        if(photo){
            if(
                required(name) &&
                required(trademark) &&
                required(model) &&
                required(status) &&
                required(safeguardApartment) &&
                required(safeguardPerson) &&
                required(location)
            ){
                
                const payloadData = {
                        "codebar": code,
                        location,
                        model,
                        name,
                        notes,
                        safeguardApartment,
                        safeguardPerson,
                        series,
                        status,
                        trademark,
                }
                sound.notification();
                Alert.alert('Confirmación!', '¿Esta seguro de continuar con el registro del equipo?', [
                    {
                        text: 'Continuar', onPress: () => {
                            sound.touch();
                            saveQueue(payloadData)
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => {
                            sound.touch()
                        },
                        style: 'cancel',
                    },
                ])

                
                return
            }
            Alert.alert('Información incompleta', 'Por favor verifique que ha ingresado todos los elementos requeridos')
            sound.notification()
            return
        }
        Alert.alert('Atención', 'Es necesario que captures la fotografía del equipo a registrar')
        sound.notification()
    }

    const header = <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        {
            !processMode && <InternalHeader title={"Registro de Equipo"} leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
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
                                <Text style={[textStyles.md, textStyles.bold, colors.black]}>Registrando información</Text>
                                <Text style={[textStyles.md]}>{code}</Text>
                            </View>
                        }

                        {
                            step === 2 && <View style={{marginVertical: 20, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={[textStyles.md, textStyles.bold, colors.black]}>Subiendo Fotografía</Text>
                                <Text style={[textStyles.md, textStyles.bold, colors.black]}>{uploadProgres} %</Text>
                            </View>
                        }

                        
                    </View>
                </ScreenView>
        </View>; 
    }

    return <View style={[styles.container]}>
        {
            dbConfig && 
            <>
                {
                    readCodebarsMode && !takePhotoMode && !viewPhotoMode &&  <Modal
                        animationType="slide"
                        statusBarTranslucent={true}
                        hardwareAccelerated={true}
                        transparent={false}
                        visible={readCodebarsMode}
                        onRequestClose={disableAllFullscreenElements}
                    > 
                        <CodebarReader
                            onCallback={handleCodebarReaded}
                            onGoBack={disableAllFullscreenElements}
                            />
                    </Modal>
                }
                {
                    !takePhotoMode && !readCodebarsMode && viewPhotoMode &&  <Modal
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
                {
                    !viewPhotoMode && !readCodebarsMode && takePhotoMode &&  <Modal
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
                { header }
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
                                            flex: 1
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                                :
                                <Image
                                    resizeMethod="resize"
                                    resizeMode="stretch"
                                    source={Image404}
                                    style={[{ width: "100%" }]}
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
                    <View style={[
                        styles.bodyForm,
                        { alignItems: 'center', justifyContent: 'flex-start' }]}
                    >
                        <View style={[
                            {
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                width: '95%',
                                paddingHorizontal: 0,
                                paddingVertical: 20,
                                borderRadius: 4
                            }]}>
                            <View style={[{ paddingHorizontal: 20 }]}>
                                <Text style={[
                                    textStyles.bold,
                                    textStyles.md,
                                    textStyles.shadowLight,
                                    colors.white
                                ]}>Detalles del equipo:</Text>
                            </View>
                            <Input
                                label="Nombre del equipo"
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                placeholder="Ingresa el nombre del equipo"
                                ref={equipmentNameRef}
                                onChange={setName}
                                onSubmit={() => equipmentTrademarkRef.current.focus()}
                                value={name}
                            />
                            <Input
                                label="Marca"
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                placeholder="Ingresa la marca del equipo"
                                ref={equipmentTrademarkRef}
                                onChange={setTrademark}
                                onSubmit={() => equipmentModelRef.current.focus()}
                                value={trademark}
                            />
                            <Input
                                label="Modelo"
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                placeholder="Ingresa el modelo del equipo"
                                ref={equipmentModelRef}
                                onChange={setModel}
                                onSubmit={() => {
                                    equipmentSeriesRef.current.focus()
                                }}
                                value={model}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '75%' }}>
                                    <TextArea
                                        label="Series o códigos"
                                        placeholder="Ingresa aquí todos los códigos o series en el equipo"
                                        styleLabel={[ textStyles.shadowLight, colors.white ]}
                                        styleInput={[{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                        styleContainer={{ padding: 0, margin: 0, paddingRight: 0 }}
                                        onChange={setSeries}
                                        ref={equipmentSeriesRef}
                                        value={series}
                                    />
                                </View>
                                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={()=>{
                                            setReadCodebarsMode(true)
                                        }}
                                        style={[{
                                            width: 60,
                                            height: 60,
                                            marginLeft: 10,
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            borderRadius: 30,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 36,
                                            elevation: 4
                                        }]}>
                                        <Ionicons name="qr-code" size={24} style={colors.dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={[
                            {
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                width: '95%',
                                paddingHorizontal: 0,
                                paddingVertical: 20,
                                marginTop: 10,
                                borderRadius: 4
                            }]}>
                            <View style={[{ paddingHorizontal: 20 }]}>
                                <Text style={[
                                    textStyles.bold,
                                    textStyles.md,
                                    textStyles.shadowLight,
                                    colors.white
                                ]}>Detalles del resguardo:</Text>
                            </View>

                            <Select
                                label="Departamento resguardante"
                                title="Departamentos registrados"
                                items={dbConfig.locations}
                                onChange={setSafeguardApartment}
                                styleContainer={[{
                                    paddingHorizontal: 30
                                }]}
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                value={safeguardApartment}
                                />      

                            <Input
                                label="Persona resguardante"
                                onChange={setSafeguardPerson}
                                placeholder="Nombre de la persona resguardante"
                                styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                value={safeguardPerson}
                            />
                            <Select
                                label="Ubicación Actual"
                                title="Ubicacion actual del equipo"
                                items={dbConfig.locations}
                                onChange={setLocation}
                                styleContainer={[{
                                    paddingHorizontal: 30
                                }]}
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                value={location}
                                />
                        </View>
                        <View style={[
                            {
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                width: '95%',
                                paddingHorizontal: 0,
                                paddingVertical: 20,
                                marginTop: 10,
                                borderRadius: 4
                            }]}>
                            <Select
                                styleContainer={{ paddingHorizontal: 30 }}
                                styleLabel={[ textStyles.shadowLight, colors.white ]}
                                label="Estado"
                                title="Estado actual del equipo"
                                items={dbConfig.equipmentStates}
                                value={status}
                                onChange={setStatus}
                            />
                            <View style={{ width: '95%' }}>
                                <TextArea
                                    label="Notas adicionales"
                                    placeholder="Ingresa los detalles adicionales, notas de resguardo o estado del equipo"
                                    styleInput={[{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                                    styleLabel={[ textStyles.shadowLight, colors.white ]}
                                    styleContainer={{ padding: 0, margin: 0, paddingRight: 0 }}
                                    onChange={setNotes}
                                    value={notes}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.controls]}>
                        <TouchableOpacity
                            onPress={save}
                            style={[styles.button, { flex: 3 }, background.darkgreen]}>
                            <Text style={{ color: 'white', marginRight: 10 }}>Registrar Revisión</Text>
                            <Ionicons name="save-outline" size={28} style={{ color: 'white' }} />
                        </TouchableOpacity>
                    </View>
                </ScreenView>
            </>
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
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
    bodyForm: {
        backgroundColor: 'transparent',
        width: '100%',
        minHeight: 400,
        top: -20,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'black',
        borderRadius: 4,
        padding: 4,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default RegisterEquipmentView;