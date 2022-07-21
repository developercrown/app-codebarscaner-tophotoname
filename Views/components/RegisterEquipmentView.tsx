import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity, Modal } from 'react-native';
import ScreenView from '../../components/ScreenView';
import { background, colors, textStyles } from '../../components/Styles';
import useHeaderbar from '../../hooks/useHeaderbar';

import { Image404 } from '../../assets/images';
import useSound from '../../hooks/useSound';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Input, Select, TextArea } from '../../components/FormComponents';
import { estadosEquipo, locations } from '../../components/Constants';
import CameraPhotoCapturer from '../../components/CameraPhotoCapturer';
import FullScreenImage from '../../components/FullScreenImage';


const RegisterEquipmentView = (props: any) => {
    const { navigation, route } = props;
    const { code } = route.params;
    const [photo, setPhoto] = useState<any>(null);
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [takePhotoMode, setTakePhotoMode] = useState<boolean>(false);

    // Form data states
    const [name, setName] = useState('');
    const [series, setSeries] = useState('');
    const [trademark, setTrademark] = useState('');
    const [model, setModel] = useState('');
    const [status, setStatus] = useState('ACTIVO');
    const [safeguardApartment, setSafeguardApartment] = useState('');
    const [safeguardPerson, setSafeguardPerson] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('DESCONOCIDO');

    // Form References

    const equipmentNameRef = useRef<any>();
    const equipmentTrademarkRef = useRef<any>();
    const equipmentModelRef = useRef<any>();

    const sound = useSound();

    useHeaderbar({
        hideShadow: false,
        navigation,
        leftSection: <View style={{}}>
            <Text style={[textStyles.md, textStyles.bold]}>Registro de equipo</Text>
        </View>,
        rightSection: <View></View>,
        style: {
            backgroundColor: 'rgba(255, 255, 255, .4)',
        }
    });

    const handlePhotoTaken = (photo: any) => {
        console.log('photo here', photo);
        setPhoto(photo);
        setTakePhotoMode(false)
        setViewPhotoMode(false)
    }

    const save = () => {
        alert('to save')
    }

    return <View style={[styles.container]}>
        {
            !takePhotoMode && viewPhotoMode &&  <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={viewPhotoMode}
                onRequestClose={() => {
                    setViewPhotoMode(false)
                }}
            > 
                <TouchableOpacity onPress={()=> {
                    console.log('action');
                    
                    setViewPhotoMode(false)
                }}>
                    <FullScreenImage image={photo}/>
                </TouchableOpacity>
            </Modal>
        }
        {
            !viewPhotoMode && takePhotoMode &&  <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={takePhotoMode}
                onRequestClose={() => {
                    setTakePhotoMode(false)
                }}
            > 
                <CameraPhotoCapturer handleBack={() => setTakePhotoMode(false)} handleSuccess={handlePhotoTaken}/>
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
                            backgroundColor: 'pink',
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
            >
                <View style={styles.takePhotoButton}>

                    <Ionicons name="camera" size={24} style={[colors.dark]} />
                </View>
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
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        width: '95%',
                        paddingHorizontal: 0,
                        paddingVertical: 20,
                        borderRadius: 4
                    }]}>
                    <View style={[{ paddingHorizontal: 20 }]}>
                        <Text style={[
                            textStyles.bold,
                            textStyles.md,
                            colors.black
                        ]}>Detalles del equipo:</Text>
                    </View>
                    <Input
                        label="Nombre del equipo"
                        styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                        placeholder="Ingresa el nombre del equipo"
                        ref={equipmentNameRef}
                        onChange={setName}
                        value={name}
                    />
                    <Input
                        label="Marca"
                        styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                        placeholder="Ingresa la marca del equipo"
                        ref={equipmentTrademarkRef}
                        onChange={setTrademark}
                        value={trademark}
                    />
                    <Input
                        label="Modelo"
                        styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                        placeholder="Ingresa el modelo del equipo"
                        ref={equipmentModelRef}
                        onChange={setModel}
                        value={model}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '75%' }}>
                            <TextArea
                                label="Series o códigos"
                                placeholder="Ingresa aquí todos los códigos o series en el equipo"
                                styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                                styleContainer={{ padding: 0, margin: 0, paddingRight: 0 }}
                                onChange={setSeries}
                                value={series}
                            />
                        </View>
                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={()=>{
                                    alert("action to get codes from scancode fullscreen")
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
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
                            colors.black
                        ]}>Detalles del resguardo:</Text>
                    </View>
                    <Input
                        label="Departamento resguardante"
                        onChange={setSafeguardApartment}
                        placeholder="Nombre del departamento resguardante"
                        styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                        value={safeguardApartment}
                    />

                    <Input
                        label="Persona resguardante"
                        onChange={setSafeguardPerson}
                        placeholder="Nombre de la persona resguardante"
                        styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                        value={safeguardPerson}
                    />
                    <Select
                        label="Ubicación Actual"
                        items={locations}
                        onChange={setLocation}
                        styleContainer={[{
                            paddingHorizontal: 30
                        }]}
                        value={location}
                        />
                </View>
                <View style={[
                    {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        width: '95%',
                        paddingHorizontal: 0,
                        paddingVertical: 20,
                        marginTop: 10,
                        borderRadius: 4
                    }]}>
                    <Select
                        styleContainer={{ paddingHorizontal: 30 }}
                        label="Estado"
                        items={estadosEquipo}
                        value={status}
                        onChange={setStatus}
                    />
                    <View style={{ width: '95%' }}>
                        <TextArea
                            label="Notas adicionales"
                            placeholder="Ingresa los detalles adicionales, notas de resguardo o estado del equipo"
                            styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)' }]}
                            styleContainer={{ padding: 0, margin: 0, paddingRight: 0 }}
                            onChange={setNotes}
                            value={notes}
                        />
                    </View>
                </View>
            </View>

            <View style={[styles.controls]}>
                <TouchableOpacity
                    onPress={()=>navigation.goBack()}
                    style={[styles.button, background.maroon]}>
                    <Ionicons name="close" size={40} style={{ color: 'white' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={save}
                    style={[styles.button, { flex: 3 }, background.darkgreen]}>
                    <Text style={{ color: 'white', marginRight: 10 }}>Registrar Revisión</Text>
                    <Ionicons name="save-outline" size={28} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        </ScreenView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'green',
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
        backgroundColor: 'red',
        width: '100%',
        height: 200,
        padding: 0,
        margin: 0,
        top: -10,
        borderBottomLeftRadius: 200,
        borderBottomRightRadius: 200,
        overflow: 'hidden',
        justifyContent: 'center'
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
        width: '90%',
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