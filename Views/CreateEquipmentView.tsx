import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, BackHandler, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Input, Select, TextArea } from '../Components/FormComponents';
import { locations } from './Equipment/Components/EquipmentReviewComponent';
import useSound from '../hooks/useSound';

const CreateEquipmentView = (props: any) => {
    const { codebar, gotoInit, gotoNext } = props;
    const sound = useSound();
    const [wait, setWait] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [captureMode, setCaptureMode] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [series, setSeries] = useState('');
    const [trademark, setTrademark] = useState('');
    const [model, setModel] = useState('');
    const [status, setStatus] = useState('ACTIVO');
    const [safeguardApartment, setSafeguardApartment] = useState('');
    const [safeguardPerson, setSafeguardPerson] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('DESCONOCIDO');


    const gotoCancel = () => {
        gotoInit();
    }

    const gotoContinue = () => {
        gotoNext(codebar)
    }

    const saveRow = () => {
        const payload = {
            codebar,
            name,
            series,
            trademark,
            model,
            status,
            safeguardApartment,
            safeguardPerson,
            notes,
            location
        };
        setWait(true)
        const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/';
        axios({
            method: 'post',
            url: uri,
            data: payload
        }).then(({ status, data }) => {
            if (status === 200) {
                alert("Registrado correctamente")
            }
            sound.success();
            gotoContinue();
        }).catch(err => {
            alert("no se pudo registrar la información")
            sound.cancel()
            setWait(false)
        });
    }

    const gotoCaptureFromCamera = () => {
        sound.touch()
        setWait(true);
        setTimeout(() => {
            setCaptureMode(true);
            setWait(false);
        }, 150);
    }

    const handleCapture = (props: any) => {
        let { data } = props
        data = data.trim()
        const value = series === '' ? data : series + ' - ' + data;
        setSeries(value.trim());
        hadlerHideCapturer(false)
        sound.msn1();
    }

    const hadlerHideCapturer = (withSound: boolean = true) => {
        setCaptureMode(false);
        setWait(false)
        if (withSound) {
            sound.cancel();
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', ()=>true);

        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        return () => backHandler.remove();
    }, []);

    if (hasPermission === null) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>Requesting for camera permission</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white' }}>No access to camera</Text></View>;
    }

    return <View style={containerStyles.container}>
        {
            wait && <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    zIndex: 3
                }}
            >
                <Text style={{ color: '#eee' }}>Un momento por favor...</Text>
            </View>
        }
        {
            captureMode && <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, .9)',
                    zIndex: 2
                }}
            >
                <View style={{ flex: 1, marginTop: 26 }}>
                    <Text style={{ color: '#eee', fontSize: 20 }}>Modo de captura de códigos</Text>
                </View>
                <BarCodeScanner
                    onBarCodeScanned={handleCapture}
                    style={StyleSheet.absoluteFillObject}
                />
                <TouchableOpacity
                    onPress={() => hadlerHideCapturer()}
                    style={[controlsStyles.button, { borderColor: 'red', borderWidth: 2, flexDirection: 'row', borderRadius: 40, width: 160, top: -30 }]}>
                    <Text style={{ color: 'white' }}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        }
        <BlurView intensity={10} style={headerStyles.container} tint="light">
            <Text style={headerStyles.title}>Registro de equipo</Text>
        </BlurView>
        <ScrollView style={[BodyStyles.container, { paddingBottom: 100 }]}>
            <View style={BodyStyles.headerTitleContainer}>
                <Text style={[controlsStyles.textButtonWhite, { fontSize: 20 }]}>Código de barras</Text>
                <Text style={[controlsStyles.textButtonWhite, { fontSize: 16 }]}>{codebar}</Text>
            </View>
            <Input label="Nombre del equipo" value={name} onChange={setName} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 4 }}>
                    <TextArea label="Series o códigos" value={series} onChange={setSeries} />
                </View>
                <TouchableOpacity
                    onPress={gotoCaptureFromCamera}
                    style={[{
                        width: 60,
                        height: 60,
                        marginLeft: 10,
                        backgroundColor: 'purple',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 36
                    }]}>
                    <Ionicons name="qr-code" size={32} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
            <Input label="Marca" value={trademark} onChange={setTrademark} />
            <Input label="Modelo" value={model} onChange={setModel} />
            <Select label="Estado" items={['ACTIVO', 'BAJA']} value={status} onChange={setStatus} />
            <Input label="Departamento resguardante" value={safeguardApartment} onChange={setSafeguardApartment} />
            <Input label="Persona resguardante" value={safeguardPerson} onChange={setSafeguardPerson} />
            <TextArea label="Notas" placeholder="Ingresa tus observaciones aquí" value={notes} onChange={setNotes} />
            <Select label="Ubicación Actual" items={locations} value={location} onChange={setLocation} />
            <View style={{ padding: 10, marginTop: 4, marginBottom: 50, flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={gotoCancel}
                    style={[controlsStyles.button, controlsStyles.buttonDanger, { borderRadius: 2, flex: 1 }]}>
                    <Ionicons name="close" size={40} style={{ color: 'white' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={saveRow}
                    style={[
                        controlsStyles.button,
                        {
                            backgroundColor: 'green',
                            flex: 3,
                            flexDirection: 'row'
                        }]}>
                    <Text style={{ color: 'white', marginRight: 10 }}>Registrar Revisión</Text>
                    <Ionicons name="save-outline" size={28} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
}

const GlobalStyles = StyleSheet.create({
    alignCenter: {
        textAlign: 'center'
    },
    textSm: {
        fontSize: 16
    },
    textMd: {
        fontSize: 20
    },
    textWhite: {
        color: 'white'
    },
    textBold: {
        fontWeight: 'bold'
    },
});

const headerStyles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: 'rgba(187, 50, 203, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(71, 21, 159, .6)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    title: {
        color: '#eee',
        fontSize: 20,
        fontWeight: 'normal'
    }
});

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'blue',
    },
});

const BodyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(59, 0, 153, 0.1)',
        padding: 20,
        borderColor: 'rgba(71, 21, 159, .6)',
        borderWidth: 1
    },
    headerTitleContainer: {
        backgroundColor: 'rgba(10, 10, 10, .4)',
        borderRadius: 4,
        padding: 14,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,

    },
    informationContainer: {
        height: '100%',
        width: '100%',
        paddingBottom: 32,
        flexDirection: 'column'
    },
    legendContainer: {
        width: '93%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        bottom: 40
    },
    legend: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
});


const controlsStyles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: 'rgba(0, 0, 0, .4)'
    },
    containerCodebarInput: {

    },
    codebarInput: {
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        height: 60,
        margin: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#303042',
        shadowColor: 'black',
        padding: 10,
        textAlign: 'center'
    },
    containerControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10
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
        borderRadius: 100,
        width: 58,
        height: 58,
        padding: 0,
        margin: 8
    },
    buttonDark: {
        backgroundColor: 'rgba(17, 18, 25, 1)',
    },
    buttonDarkDisabled: {
        backgroundColor: 'rgba(17, 18, 25, .4)',
    },
    buttonDanger: {
        backgroundColor: 'rgba(143, 4, 1, 1)',
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

export default CreateEquipmentView;